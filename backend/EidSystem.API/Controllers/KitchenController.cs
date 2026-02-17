using System.Security.Claims;
using EidSystem.API.Data;
using EidSystem.API.Models.DTOs.Requests;
using EidSystem.API.Models.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EidSystem.API.Controllers;

[Authorize(Roles = "admin,order_reviewer")]
[ApiController]
[Route("api/[controller]")]
public class KitchenController : ControllerBase
{
    private readonly AppDbContext _context;

    public KitchenController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("today")]
    public async Task<ActionResult<ApiResponse<object>>> GetTodayOrders([FromQuery] int? eidDayId, [FromQuery] int? periodId)
    {
        var targetDayId = eidDayId;
        if (!targetDayId.HasValue)
        {
            var today = DateTime.Today;
            var day = await _context.EidDays.FirstOrDefaultAsync(d => d.Date.Date == today && d.IsActive)
                      ?? await _context.EidDays.OrderBy(d => d.SortOrder).FirstOrDefaultAsync(d => d.IsActive);
            targetDayId = day?.EidDayId;
        }

        if (!targetDayId.HasValue)
            return Ok(ApiResponse<object>.SuccessResponse(new List<object>()));

        var query = _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Address).ThenInclude(a => a.Area)
            .Include(o => o.EidDayPeriod).ThenInclude(p => p.DayPeriodCategory).ThenInclude(dpc => dpc.Period)
            .Include(o => o.Items).ThenInclude(i => i.ProductPrice).ThenInclude(pp => pp.Product)
            .Include(o => o.Items).ThenInclude(i => i.ProductPrice).ThenInclude(pp => pp.Size)
            .Include(o => o.Items).ThenInclude(i => i.PlateType)
            .Where(o => o.EidDayPeriod.EidDayId == targetDayId.Value)
            .AsQueryable();

        if (periodId.HasValue)
            query = query.Where(o => o.EidDayPeriodId == periodId.Value);

        var orders = await query.OrderBy(o => o.EidDayPeriod.DayPeriodCategory.Period.SortOrder).ToListAsync();

        // Kitchen view - no prices
        var result = orders.Select(o => new
        {
            o.OrderId,
            CustomerName = o.Customer.Name,
            CustomerPhone = o.Customer.Phone,
            Address = o.Address != null ? $"{o.Address.Area.NameAr} - {o.Address.AddressDetails}" : "استلام من الفرن",
            Period = o.EidDayPeriod.DayPeriodCategory.Period.NameAr,
            DeliveryTime = o.DeliveryTime?.ToString(@"hh\:mm"),
            o.Status,
            o.Notes,
            Items = o.Items.Select(i => new
            {
                ProductName = i.ProductPrice.Product.NameAr,
                Size = i.ProductPrice.Size?.NameAr,
                PlateType = i.PlateType?.NameAr,
                i.Quantity,
                i.Notes
            })
        });

        return Ok(ApiResponse<object>.SuccessResponse(result));
    }

    [HttpGet("summary")]
    public async Task<ActionResult<ApiResponse<object>>> GetProductSummary([FromQuery] int? eidDayId, [FromQuery] int? periodId)
    {
        var targetDayId = eidDayId;
        if (!targetDayId.HasValue)
        {
            var today = DateTime.Today;
            var day = await _context.EidDays.FirstOrDefaultAsync(d => d.Date.Date == today && d.IsActive)
                      ?? await _context.EidDays.OrderBy(d => d.SortOrder).FirstOrDefaultAsync(d => d.IsActive);
            targetDayId = day?.EidDayId;
        }

        if (!targetDayId.HasValue)
            return Ok(ApiResponse<object>.SuccessResponse(new { Products = new List<object>(), Plates = new List<object>() }));
        
        var query = _context.OrderItems
            .Include(i => i.Order)
            .Include(i => i.ProductPrice).ThenInclude(pp => pp.Product).ThenInclude(p => p.Category)
            .Include(i => i.ProductPrice).ThenInclude(pp => pp.Size)
            .Include(i => i.PlateType)
            .Where(i => i.Order.EidDayPeriod.EidDayId == targetDayId.Value && i.Order.Status != "cancelled")
            .AsQueryable();

        if (periodId.HasValue)
            query = query.Where(i => i.Order.EidDayPeriodId == periodId.Value);

        var items = await query.ToListAsync();

        // Group by category and product
        var summary = items
            .GroupBy(i => new { 
                CategoryName = i.ProductPrice.Product.Category.NameAr, 
                ProductName = i.ProductPrice.Product.NameAr, 
                SizeName = i.ProductPrice.Size?.NameAr 
            })
            .Select(g => new
            {
                Category = g.Key.CategoryName,
                Product = g.Key.ProductName,
                Size = g.Key.SizeName,
                TotalQuantity = g.Sum(x => x.Quantity)
            })
            .OrderBy(x => x.Category)
            .ThenBy(x => x.Product);

        // Plate types summary
        var plateSummary = items
            .Where(i => i.PlateTypeId != null)
            .GroupBy(i => i.PlateType!.NameAr)
            .Select(g => new
            {
                PlateType = g.Key,
                Count = g.Sum(x => x.Quantity)
            });

        return Ok(ApiResponse<object>.SuccessResponse(new { Products = summary, Plates = plateSummary }));
    }

    [HttpPatch("orders/{id}/status")]
    public async Task<ActionResult<ApiResponse<object>>> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
            return NotFound(ApiResponse<object>.ErrorResponse("الطلب غير موجود"));

        var allowedStatuses = new[] { "preparing", "ready", "delivered" };
        if (!allowedStatuses.Contains(request.Status))
            return BadRequest(ApiResponse<object>.ErrorResponse("حالة غير صالحة"));

        order.Status = request.Status;
        order.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null!, $"تم تحديث حالة الطلب إلى {request.Status}"));
    }

    [HttpGet("periods-by-day")]
    public async Task<ActionResult<ApiResponse<object>>> GetPeriodsByDay([FromQuery] int? eidDayId)
    {
        var targetDayId = eidDayId;
        if (!targetDayId.HasValue)
        {
            var today = DateTime.Today;
            var day = await _context.EidDays.FirstOrDefaultAsync(d => d.Date.Date == today && d.IsActive)
                      ?? await _context.EidDays.OrderBy(d => d.SortOrder).FirstOrDefaultAsync(d => d.IsActive);
            targetDayId = day?.EidDayId;
        }

        if (!targetDayId.HasValue)
            return Ok(ApiResponse<object>.SuccessResponse(new List<object>()));
        
        var periods = await _context.EidDayPeriods
            .Include(p => p.EidDay)
            .Include(p => p.DayPeriodCategory).ThenInclude(dpc => dpc.Period)
            .Include(p => p.DayPeriodCategory).ThenInclude(dpc => dpc.Category)
            .Where(p => p.EidDayId == targetDayId.Value && p.IsActive)
            .OrderBy(p => p.DayPeriodCategory.Period.SortOrder)
            .Select(p => new
            {
                p.EidDayPeriodId,
                PeriodName = p.DayPeriodCategory.Period.NameAr,
                CategoryName = p.DayPeriodCategory.Category.NameAr,
                p.DayPeriodCategory.Period.StartTime,
                p.DayPeriodCategory.Period.EndTime,
                OrderCount = _context.Orders.Count(o => o.EidDayPeriodId == p.EidDayPeriodId && o.Status != "cancelled")
            })
            .ToListAsync();

        return Ok(ApiResponse<object>.SuccessResponse(periods));
    }
}
