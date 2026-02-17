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
public class EidDaysController : ControllerBase
{
    private readonly AppDbContext _context;

    public EidDaysController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<EidDayResponse>>>> GetAll()
    {
        var days = await _context.EidDays
            .Include(d => d.EidDayPeriods)
                .ThenInclude(edp => edp.DayPeriodCategory)
                    .ThenInclude(dpc => dpc.Period)
            .Include(d => d.EidDayPeriods)
                .ThenInclude(edp => edp.DayPeriodCategory)
                    .ThenInclude(dpc => dpc.Category)
            .OrderBy(d => d.SortOrder)
            .ToListAsync();

        var result = days.Select(d => new EidDayResponse
        {
            EidDayId = d.EidDayId,
            NameAr = d.NameAr,
            NameEn = d.NameEn,
            Date = d.Date,
            DayNumber = d.DayNumber,
            IsActive = d.IsActive,
            SortOrder = d.SortOrder,
            Periods = d.EidDayPeriods
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
                }).ToList()
        });

        return Ok(ApiResponse<IEnumerable<EidDayResponse>>.SuccessResponse(result));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<EidDayResponse>>> GetById(int id)
    {
        var day = await _context.EidDays
            .Include(d => d.EidDayPeriods)
                .ThenInclude(edp => edp.DayPeriodCategory)
                    .ThenInclude(dpc => dpc.Period)
            .Include(d => d.EidDayPeriods)
                .ThenInclude(edp => edp.DayPeriodCategory)
                    .ThenInclude(dpc => dpc.Category)
            .FirstOrDefaultAsync(d => d.EidDayId == id);

        if (day == null)
            return NotFound(ApiResponse<EidDayResponse>.ErrorResponse("اليوم غير موجود"));

        var result = new EidDayResponse
        {
            EidDayId = day.EidDayId,
            NameAr = day.NameAr,
            NameEn = day.NameEn,
            Date = day.Date,
            DayNumber = day.DayNumber,
            IsActive = day.IsActive,
            SortOrder = day.SortOrder,
            Periods = day.EidDayPeriods
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
                }).ToList()
        };

        return Ok(ApiResponse<EidDayResponse>.SuccessResponse(result));
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<EidDayResponse>>> Create([FromBody] CreateEidDayRequest request)
    {
        var day = new EidDay
        {
            NameAr = request.NameAr,
            NameEn = request.NameEn,
            Date = request.Date,
            DayNumber = request.DayNumber,
            SortOrder = request.SortOrder,
            IsActive = true
        };

        _context.EidDays.Add(day);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<EidDayResponse>.SuccessResponse(new EidDayResponse
        {
            EidDayId = day.EidDayId,
            NameAr = day.NameAr,
            NameEn = day.NameEn,
            Date = day.Date,
            DayNumber = day.DayNumber,
            IsActive = day.IsActive,
            SortOrder = day.SortOrder
        }, "تم إنشاء يوم العيد بنجاح"));
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<EidDayResponse>>> Update(int id, [FromBody] UpdateEidDayRequest request)
    {
        var day = await _context.EidDays.FindAsync(id);
        if (day == null)
            return NotFound(ApiResponse<EidDayResponse>.ErrorResponse("اليوم غير موجود"));

        if (request.NameAr != null) day.NameAr = request.NameAr;
        if (request.NameEn != null) day.NameEn = request.NameEn;
        if (request.Date.HasValue) day.Date = request.Date.Value;
        if (request.DayNumber.HasValue) day.DayNumber = request.DayNumber.Value;
        if (request.IsActive.HasValue) day.IsActive = request.IsActive.Value;
        if (request.SortOrder.HasValue) day.SortOrder = request.SortOrder.Value;

        await _context.SaveChangesAsync();

        return Ok(ApiResponse<EidDayResponse>.SuccessResponse(new EidDayResponse
        {
            EidDayId = day.EidDayId,
            NameAr = day.NameAr,
            NameEn = day.NameEn,
            Date = day.Date,
            DayNumber = day.DayNumber,
            IsActive = day.IsActive,
            SortOrder = day.SortOrder
        }, "تم تحديث يوم العيد بنجاح"));
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        var day = await _context.EidDays.FindAsync(id);
        if (day == null)
            return NotFound(ApiResponse<object>.ErrorResponse("اليوم غير موجود"));

        day.IsActive = false;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null!, "تم حذف يوم العيد بنجاح"));
    }

    [Authorize(Roles = "admin")]
    [HttpPost("{id}/assign-bulk")]
    public async Task<ActionResult<ApiResponse<object>>> AssignPeriodCategories(int id, [FromBody] BulkAssignCategoriesRequest request)
    {
        var day = await _context.EidDays.FindAsync(id);
        if (day == null)
            return NotFound(ApiResponse<object>.ErrorResponse("اليوم غير موجود"));

        if (request.Assignments == null || !request.Assignments.Any())
            return BadRequest(ApiResponse<object>.ErrorResponse("لم يتم تحديد أي فترات للتعيين"));

        var addedCount = 0;
        foreach (var assignment in request.Assignments)
        {
            var exists = await _context.EidDayPeriods.AnyAsync(p => p.EidDayId == id && p.DayPeriodCategoryId == assignment.DayPeriodCategoryId);
            if (exists) continue;

            var edp = new EidDayPeriod
            {
                EidDayId = id,
                DayPeriodCategoryId = assignment.DayPeriodCategoryId,
                MaxCapacity = assignment.MaxCapacity,
                CurrentOrders = 0,
                IsActive = true
            };
            _context.EidDayPeriods.Add(edp);
            addedCount++;
        }

        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null!, $"تم تعيين {addedCount} فترة لليوم بنجاح"));
    }
}
