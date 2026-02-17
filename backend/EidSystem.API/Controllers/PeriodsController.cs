using EidSystem.API.Data;
using EidSystem.API.Models.DTOs.Requests;
using EidSystem.API.Models.DTOs.Responses;
using EidSystem.API.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EidSystem.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PeriodsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PeriodsController(AppDbContext context)
    {
        _context = context;
    }

    // Day Periods (templates)
    [HttpGet("templates")]
    public async Task<ActionResult<ApiResponse<IEnumerable<DayPeriodResponse>>>> GetTemplates()
    {
        var periods = await _context.DayPeriods
            .Include(p => p.DayPeriodCategories)
                .ThenInclude(dpc => dpc.Category)
            .OrderBy(p => p.SortOrder)
            .ToListAsync();

        var result = periods.Select(p => new DayPeriodResponse
        {
            PeriodId = p.PeriodId,
            NameAr = p.NameAr,
            NameEn = p.NameEn,
            StartTime = p.StartTime,
            EndTime = p.EndTime,
            DefaultCapacity = p.DefaultCapacity,
            IsActive = p.IsActive,
            SortOrder = p.SortOrder,
            Categories = p.DayPeriodCategories.Select(dpc => new DayPeriodCategoryResponse
            {
                DayPeriodCategoryId = dpc.DayPeriodCategoryId,
                CategoryId = dpc.CategoryId,
                NameAr = dpc.Category.NameAr,
                NameEn = dpc.Category.NameEn,
                Description = dpc.Category.Description,
                IsActive = dpc.Category.IsActive,
                SortOrder = dpc.Category.SortOrder,
                ProductCount = dpc.Category.Products?.Count ?? 0
            }).ToList()
        });

        return Ok(ApiResponse<IEnumerable<DayPeriodResponse>>.SuccessResponse(result));
    }

    [HttpGet("templates/{id}/categories")]
    public async Task<ActionResult<ApiResponse<IEnumerable<CategoryResponse>>>> GetTemplateCategories(int id)
    {
        var categories = await _context.DayPeriodCategories
            .Include(dpc => dpc.Category)
            .Where(dpc => dpc.PeriodId == id)
            .Select(dpc => new CategoryResponse
            {
                CategoryId = dpc.CategoryId,
                NameAr = dpc.Category.NameAr,
                NameEn = dpc.Category.NameEn,
                Description = dpc.Category.Description,
                IsActive = dpc.Category.IsActive,
                SortOrder = dpc.Category.SortOrder
            })
            .ToListAsync();

        return Ok(ApiResponse<IEnumerable<CategoryResponse>>.SuccessResponse(categories));
    }

    [Authorize(Roles = "admin")]
    [HttpPost("templates")]
    public async Task<ActionResult<ApiResponse<DayPeriodResponse>>> CreateTemplate([FromBody] CreateDayPeriodRequest request)
    {
        var period = new DayPeriod
        {
            NameAr = request.NameAr,
            NameEn = request.NameEn,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            DefaultCapacity = request.DefaultCapacity,
            SortOrder = request.SortOrder,
            IsActive = true
        };

        _context.DayPeriods.Add(period);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<DayPeriodResponse>.SuccessResponse(new DayPeriodResponse
        {
            PeriodId = period.PeriodId,
            NameAr = period.NameAr,
            NameEn = period.NameEn,
            StartTime = period.StartTime,
            EndTime = period.EndTime,
            DefaultCapacity = period.DefaultCapacity,
            IsActive = period.IsActive,
            SortOrder = period.SortOrder
        }, "تم إنشاء الفترة بنجاح"));
    }

    [Authorize(Roles = "admin")]
    [HttpPost("template-with-categories")]
    public async Task<ActionResult<ApiResponse<DayPeriodResponse>>> CreateWithCategories([FromBody] CreateDayPeriodWithCategoriesRequest request)
    {
        var period = new DayPeriod
        {
            NameAr = request.NameAr,
            NameEn = request.NameEn,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            DefaultCapacity = request.DefaultCapacity,
            SortOrder = request.SortOrder,
            IsActive = true
        };

        _context.DayPeriods.Add(period);
        await _context.SaveChangesAsync();

        if (request.CategoryIds != null && request.CategoryIds.Any())
        {
            // validate category ids and deduplicate
            var distinctIds = request.CategoryIds.Distinct().ToList();
            var existingCategoryIds = await _context.Categories
                .Where(c => distinctIds.Contains(c.CategoryId))
                .Select(c => c.CategoryId)
                .ToListAsync();

            var missing = distinctIds.Except(existingCategoryIds).ToList();
            if (missing.Any())
                return NotFound(ApiResponse<DayPeriodResponse>.ErrorResponse($"التصنيفات غير موجودة: {string.Join(',', missing)}"));

            foreach (var catId in distinctIds)
            {
                _context.DayPeriodCategories.Add(new DayPeriodCategory
                {
                    PeriodId = period.PeriodId,
                    CategoryId = catId
                });
            }
            await _context.SaveChangesAsync();
        }

        // Return full response
        var result = await _context.DayPeriods
            .Include(p => p.DayPeriodCategories)
                .ThenInclude(dpc => dpc.Category)
            .FirstOrDefaultAsync(p => p.PeriodId == period.PeriodId);

        return Ok(ApiResponse<DayPeriodResponse>.SuccessResponse(new DayPeriodResponse
        {
            PeriodId = result!.PeriodId,
            NameAr = result.NameAr,
            NameEn = result.NameEn,
            StartTime = result.StartTime,
            EndTime = result.EndTime,
            DefaultCapacity = result.DefaultCapacity,
            IsActive = result.IsActive,
            SortOrder = result.SortOrder,
            Categories = result.DayPeriodCategories.Select(dpc => new DayPeriodCategoryResponse
            {
                DayPeriodCategoryId = dpc.DayPeriodCategoryId,
                CategoryId = dpc.CategoryId,
                NameAr = dpc.Category.NameAr,
                NameEn = dpc.Category.NameEn,
                Description = dpc.Category.Description,
                IsActive = dpc.Category.IsActive,
                SortOrder = dpc.Category.SortOrder,
                ProductCount = dpc.Category.Products?.Count ?? 0
            }).ToList()
        }, "تم إنشاء الفترة وربطها بالكاتجوري بنجاح"));
    }

    [Authorize(Roles = "admin")]
    [HttpPost("{periodId}/categories")]
    public async Task<ActionResult<ApiResponse<DayPeriodResponse>>> AddCategoryToTemplate(int periodId, [FromBody] int categoryId)
    {
        var period = await _context.DayPeriods
            .Include(p => p.DayPeriodCategories).ThenInclude(dpc => dpc.Category)
            .FirstOrDefaultAsync(p => p.PeriodId == periodId);
        if (period == null)
            return NotFound(ApiResponse<DayPeriodResponse>.ErrorResponse("الفترة غير موجودة"));

        var category = await _context.Categories.FindAsync(categoryId);
        if (category == null)
            return NotFound(ApiResponse<DayPeriodResponse>.ErrorResponse("التصنيف غير موجود"));

        var exists = await _context.DayPeriodCategories.AnyAsync(dpc => dpc.PeriodId == periodId && dpc.CategoryId == categoryId);
        if (exists)
            return BadRequest(ApiResponse<DayPeriodResponse>.ErrorResponse("التصنيف مرتبط بالفعل بالفترة"));

        var dpcEntry = new DayPeriodCategory { PeriodId = periodId, CategoryId = categoryId };
        _context.DayPeriodCategories.Add(dpcEntry);
        await _context.SaveChangesAsync();

        // reload period with categories
        var result = await _context.DayPeriods
            .Include(p => p.DayPeriodCategories).ThenInclude(dpc => dpc.Category)
            .FirstOrDefaultAsync(p => p.PeriodId == periodId);

        return Ok(ApiResponse<DayPeriodResponse>.SuccessResponse(new DayPeriodResponse
        {
            PeriodId = result!.PeriodId,
            NameAr = result.NameAr,
            NameEn = result.NameEn,
            StartTime = result.StartTime,
            EndTime = result.EndTime,
            DefaultCapacity = result.DefaultCapacity,
            IsActive = result.IsActive,
            SortOrder = result.SortOrder,
            Categories = result.DayPeriodCategories.Select(dpc => new DayPeriodCategoryResponse
            {
                DayPeriodCategoryId = dpc.DayPeriodCategoryId,
                CategoryId = dpc.CategoryId,
                NameAr = dpc.Category.NameAr,
                NameEn = dpc.Category.NameEn,
                Description = dpc.Category.Description,
                IsActive = dpc.Category.IsActive,
                SortOrder = dpc.Category.SortOrder,
                ProductCount = dpc.Category.Products?.Count ?? 0
            }).ToList()
        }, "تم إضافة التصنيف للفترة بنجاح"));
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{periodId}/categories/{categoryId}")]
    public async Task<ActionResult<ApiResponse<DayPeriodResponse>>> RemoveCategoryFromTemplate(int periodId, int categoryId)
    {
        var dpc = await _context.DayPeriodCategories.FirstOrDefaultAsync(x => x.PeriodId == periodId && x.CategoryId == categoryId);
        if (dpc == null)
            return NotFound(ApiResponse<DayPeriodResponse>.ErrorResponse("علاقة الفترة والتصنيف غير موجودة"));

        var assigned = await _context.EidDayPeriods.AnyAsync(edp => edp.DayPeriodCategoryId == dpc.DayPeriodCategoryId);
        if (assigned)
            return BadRequest(ApiResponse<DayPeriodResponse>.ErrorResponse("لا يمكن إزالة التصنيف لأن الفئة مُستخدمة في فترات مضافة لليوم"));

        _context.DayPeriodCategories.Remove(dpc);
        await _context.SaveChangesAsync();

        var result = await _context.DayPeriods
            .Include(p => p.DayPeriodCategories).ThenInclude(dpc2 => dpc2.Category)
            .FirstOrDefaultAsync(p => p.PeriodId == periodId);

        return Ok(ApiResponse<DayPeriodResponse>.SuccessResponse(new DayPeriodResponse
        {
            PeriodId = result!.PeriodId,
            NameAr = result.NameAr,
            NameEn = result.NameEn,
            StartTime = result.StartTime,
            EndTime = result.EndTime,
            DefaultCapacity = result.DefaultCapacity,
            IsActive = result.IsActive,
            SortOrder = result.SortOrder,
            Categories = result.DayPeriodCategories.Select(dpc2 => new DayPeriodCategoryResponse
            {
                DayPeriodCategoryId = dpc2.DayPeriodCategoryId,
                CategoryId = dpc2.CategoryId,
                NameAr = dpc2.Category.NameAr,
                NameEn = dpc2.Category.NameEn,
                Description = dpc2.Category.Description,
                IsActive = dpc2.Category.IsActive,
                SortOrder = dpc2.Category.SortOrder,
                ProductCount = dpc2.Category.Products?.Count ?? 0
            }).ToList()
        }, "تم حذف التصنيف من الفترة بنجاح"));
    }

    // EidDayPeriods (actual periods for specific days)
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<EidDayPeriodResponse>>>> GetAll([FromQuery] int? eidDayId, [FromQuery] int? categoryId)
    {
        var query = _context.EidDayPeriods
            .Include(p => p.EidDay)
            .Include(p => p.DayPeriodCategory).ThenInclude(dpc => dpc.Period)
            .Include(p => p.DayPeriodCategory).ThenInclude(dpc => dpc.Category)
            .AsQueryable();

        if (eidDayId.HasValue)
            query = query.Where(p => p.EidDayId == eidDayId.Value);
        
        if (categoryId.HasValue)
            query = query.Where(p => p.DayPeriodCategory.CategoryId == categoryId.Value);

        var periods = await query.OrderBy(p => p.EidDay.SortOrder).ThenBy(p => p.DayPeriodCategory.Period.SortOrder).ToListAsync();

        var result = periods.Select(p => new EidDayPeriodResponse
        {
            EidDayPeriodId = p.EidDayPeriodId,
            EidDayId = p.EidDayId,
            EidDayName = p.EidDay.NameAr,
            EidDayDate = p.EidDay.Date,
            DayPeriodCategoryId = p.DayPeriodCategoryId,
            PeriodId = p.DayPeriodCategory.PeriodId,
            PeriodName = p.DayPeriodCategory.Period.NameAr,
            CategoryId = p.DayPeriodCategory.CategoryId,
            CategoryName = p.DayPeriodCategory.Category.NameAr,
            StartTime = p.DayPeriodCategory.Period.StartTime,
            EndTime = p.DayPeriodCategory.Period.EndTime,
            MaxCapacity = p.MaxCapacity,
            CurrentOrders = p.CurrentOrders,
            AvailableAmount = p.AvailableAmount,
            IsActive = p.IsActive,
            IsFull = p.CurrentOrders >= p.MaxCapacity
        });

        return Ok(ApiResponse<IEnumerable<EidDayPeriodResponse>>.SuccessResponse(result));
    }

    [HttpGet("day/{eidDayId}/grouped")]
    public async Task<ActionResult<ApiResponse<IEnumerable<GroupedEidDayPeriodResponse>>>> GetGroupedByDay(int eidDayId)
    {
        var periods = await _context.EidDayPeriods
            .Include(p => p.EidDay)
            .Include(p => p.DayPeriodCategory).ThenInclude(dpc => dpc.Period)
            .Include(p => p.DayPeriodCategory).ThenInclude(dpc => dpc.Category)
            .Where(p => p.EidDayId == eidDayId && p.IsActive)
            .ToListAsync();

        var result = periods
            .GroupBy(p => new { p.DayPeriodCategory.PeriodId, p.DayPeriodCategory.Period.NameAr, p.DayPeriodCategory.Period.StartTime, p.DayPeriodCategory.Period.EndTime, p.DayPeriodCategory.Period.SortOrder })
            .OrderBy(g => g.Key.SortOrder)
            .Select(g => new GroupedEidDayPeriodResponse
            {
                PeriodId = g.Key.PeriodId,
                PeriodName = g.Key.NameAr,
                StartTime = g.Key.StartTime,
                EndTime = g.Key.EndTime,
                CategoryCapacities = g.Select(p => new CategoryCapacityResponse
                {
                    EidDayPeriodId = p.EidDayPeriodId,
                    CategoryId = p.DayPeriodCategory.CategoryId,
                    CategoryName = p.DayPeriodCategory.Category.NameAr,
                    MaxCapacity = p.MaxCapacity,
                    CurrentOrders = p.CurrentOrders,
                    AvailableAmount = p.AvailableAmount,
                    IsFull = p.CurrentOrders >= p.MaxCapacity
                }).ToList()
            });

        return Ok(ApiResponse<IEnumerable<GroupedEidDayPeriodResponse>>.SuccessResponse(result));
    }

    [HttpGet("available")]
    public async Task<ActionResult<ApiResponse<IEnumerable<EidDayPeriodResponse>>>> GetAvailable([FromQuery] int? categoryId)
    {
        var query = _context.EidDayPeriods
            .Include(p => p.EidDay)
            .Include(p => p.DayPeriodCategory).ThenInclude(dpc => dpc.Period)
            .Include(p => p.DayPeriodCategory).ThenInclude(dpc => dpc.Category)
            .Where(p => p.IsActive && p.EidDay.IsActive && p.CurrentOrders < p.MaxCapacity)
            .AsQueryable();

        if (categoryId.HasValue)
            query = query.Where(p => p.DayPeriodCategory.CategoryId == categoryId.Value);

        var periods = await query.OrderBy(p => p.EidDay.SortOrder).ThenBy(p => p.DayPeriodCategory.Period.SortOrder).ToListAsync();

        var result = periods.Select(p => new EidDayPeriodResponse
        {
            EidDayPeriodId = p.EidDayPeriodId,
            EidDayId = p.EidDayId,
            EidDayName = p.EidDay.NameAr,
            EidDayDate = p.EidDay.Date,
            DayPeriodCategoryId = p.DayPeriodCategoryId,
            PeriodId = p.DayPeriodCategory.PeriodId,
            PeriodName = p.DayPeriodCategory.Period.NameAr,
            CategoryId = p.DayPeriodCategory.CategoryId,
            CategoryName = p.DayPeriodCategory.Category.NameAr,
            StartTime = p.DayPeriodCategory.Period.StartTime,
            EndTime = p.DayPeriodCategory.Period.EndTime,
            MaxCapacity = p.MaxCapacity,
            CurrentOrders = p.CurrentOrders,
            AvailableAmount = p.AvailableAmount,
            IsActive = p.IsActive,
            IsFull = false
        });

        return Ok(ApiResponse<IEnumerable<EidDayPeriodResponse>>.SuccessResponse(result));
    }

    [Authorize(Roles = "admin")]
    [HttpPost("{eidDayId}/assign/{dayPeriodCategoryId}")]
    public async Task<ActionResult<ApiResponse<EidDayPeriodResponse>>> AssignPeriodToDay(int eidDayId, int dayPeriodCategoryId, [FromQuery] int? capacity)
    {
        var day = await _context.EidDays.FindAsync(eidDayId);
        if (day == null)
            return NotFound(ApiResponse<EidDayPeriodResponse>.ErrorResponse("اليوم غير موجود"));

        var dpc = await _context.DayPeriodCategories
            .Include(x => x.Period)
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.DayPeriodCategoryId == dayPeriodCategoryId);
        if (dpc == null)
            return NotFound(ApiResponse<EidDayPeriodResponse>.ErrorResponse("علاقة الفترة والكاتجوري غير موجودة"));

        var existing = await _context.EidDayPeriods.FirstOrDefaultAsync(p => p.EidDayId == eidDayId && p.DayPeriodCategoryId == dayPeriodCategoryId);
        if (existing != null)
            return BadRequest(ApiResponse<EidDayPeriodResponse>.ErrorResponse("الفترة مضافة مسبقاً لهذا اليوم"));

        var edp = new EidDayPeriod
        {
            EidDayId = eidDayId,
            DayPeriodCategoryId = dayPeriodCategoryId,
            MaxCapacity = capacity ?? dpc.Period.DefaultCapacity,
            CurrentOrders = 0,
            IsActive = true
        };

        _context.EidDayPeriods.Add(edp);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<EidDayPeriodResponse>.SuccessResponse(new EidDayPeriodResponse
        {
            EidDayPeriodId = edp.EidDayPeriodId,
            EidDayId = edp.EidDayId,
            EidDayName = day.NameAr,
            EidDayDate = day.Date,
            DayPeriodCategoryId = edp.DayPeriodCategoryId,
            PeriodId = dpc.PeriodId,
            PeriodName = dpc.Period.NameAr,
            CategoryId = dpc.CategoryId,
            CategoryName = dpc.Category.NameAr,
            MaxCapacity = edp.MaxCapacity,
            CurrentOrders = edp.CurrentOrders,
            AvailableAmount = edp.AvailableAmount,
            IsActive = edp.IsActive
        }, "تم تعيين الفترة لليوم بنجاح"));
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<EidDayPeriodResponse>>> UpdatePeriod(int id, [FromBody] UpdateEidDayPeriodRequest request)
    {
        var edp = await _context.EidDayPeriods
            .Include(p => p.EidDay)
            .Include(p => p.DayPeriodCategory).ThenInclude(dpc => dpc.Period)
            .Include(p => p.DayPeriodCategory).ThenInclude(dpc => dpc.Category)
            .FirstOrDefaultAsync(p => p.EidDayPeriodId == id);

        if (edp == null)
            return NotFound(ApiResponse<EidDayPeriodResponse>.ErrorResponse("الفترة غير موجودة"));

        if (request.MaxCapacity.HasValue) edp.MaxCapacity = request.MaxCapacity.Value;
        if (request.IsActive.HasValue) edp.IsActive = request.IsActive.Value;

        await _context.SaveChangesAsync();

        return Ok(ApiResponse<EidDayPeriodResponse>.SuccessResponse(new EidDayPeriodResponse
        {
            EidDayPeriodId = edp.EidDayPeriodId,
            EidDayId = edp.EidDayId,
            EidDayName = edp.EidDay.NameAr,
            EidDayDate = edp.EidDay.Date,
            DayPeriodCategoryId = edp.DayPeriodCategoryId,
            PeriodId = edp.DayPeriodCategory.PeriodId,
            PeriodName = edp.DayPeriodCategory.Period.NameAr,
            CategoryId = edp.DayPeriodCategory.CategoryId,
            CategoryName = edp.DayPeriodCategory.Category.NameAr,
            MaxCapacity = edp.MaxCapacity,
            CurrentOrders = edp.CurrentOrders,
            AvailableAmount = edp.AvailableAmount,
            IsActive = edp.IsActive
        }, "تم تحديث الفترة بنجاح"));
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("templates/{periodId}")]
    public async Task<ActionResult<ApiResponse<DayPeriodResponse>>> DeleteTemplate(int periodId)
    {
        var period = await _context.DayPeriods
            .Include(p => p.DayPeriodCategories).ThenInclude(dpc => dpc.EidDayPeriods)
            .Include(p => p.DayPeriodCategories).ThenInclude(dpc => dpc.Category)
            .FirstOrDefaultAsync(p => p.PeriodId == periodId);

        if (period == null)
            return NotFound(ApiResponse<DayPeriodResponse>.ErrorResponse("الفترة غير موجودة"));

        // Collect EidDayPeriod ids related to this template (via DayPeriodCategories)
        var dpcIds = period.DayPeriodCategories.Select(dpc => dpc.DayPeriodCategoryId).ToList();
        var eidDayPeriods = await _context.EidDayPeriods.Where(edp => dpcIds.Contains(edp.DayPeriodCategoryId)).ToListAsync();

        // Prevent deletion if any related EidDayPeriod has orders (safety)
        if (eidDayPeriods.Any(edp => edp.CurrentOrders > 0))
            return BadRequest(ApiResponse<DayPeriodResponse>.ErrorResponse("لا يمكن حذف الفترة لأن هناك طلبات مرتبطة بأحد الفترات المضافة لليوم"));

        // Also double-check Orders table (defensive) to avoid FK constraint failures
        var edpIds = eidDayPeriods.Select(e => e.EidDayPeriodId).ToList();
        if (edpIds.Any())
        {
            var ordersExist = await _context.Orders.AnyAsync(o => edpIds.Contains(o.EidDayPeriodId));
            if (ordersExist)
                return BadRequest(ApiResponse<DayPeriodResponse>.ErrorResponse("لا يمكن حذف الفترة لأن هناك طلبات مرتبطة بأحد الفترات المضافة لليوم"));
        }

        // Save a shallow copy of the period for the response
        var responseDto = new DayPeriodResponse
        {
            PeriodId = period.PeriodId,
            NameAr = period.NameAr,
            NameEn = period.NameEn,
            StartTime = period.StartTime,
            EndTime = period.EndTime,
            DefaultCapacity = period.DefaultCapacity,
            IsActive = period.IsActive,
            SortOrder = period.SortOrder,
            Categories = period.DayPeriodCategories.Select(dpc => new DayPeriodCategoryResponse
            {
                DayPeriodCategoryId = dpc.DayPeriodCategoryId,
                CategoryId = dpc.CategoryId,
                NameAr = dpc.Category?.NameAr,
                NameEn = dpc.Category?.NameEn,
                Description = dpc.Category?.Description,
                IsActive = dpc.Category?.IsActive ?? false,
                SortOrder = dpc.Category?.SortOrder ?? 0,
                ProductCount = dpc.Category?.Products?.Count ?? 0
            }).ToList()
        };

        // Deleting the DayPeriod will cascade (EF/DB) to DayPeriodCategories and EidDayPeriods
        _context.DayPeriods.Remove(period);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<DayPeriodResponse>.SuccessResponse(responseDto, "تم حذف الفترة بنجاح"));
    }
}
