using EidSystem.API.Data;
using EidSystem.API.Models.DTOs.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EidSystem.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReportsController(AppDbContext context)
    {
        _context = context;
    }

    // 1. فاتورة العميل (Customer Invoice)
    [HttpGet("invoice/{orderId}")]
    public async Task<ActionResult<ApiResponse<object>>> GetCustomerInvoice(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Address).ThenInclude(a => a.Area)
            .Include(o => o.EidDayPeriod).ThenInclude(p => p.DayPeriodCategory).ThenInclude(dpc => dpc.Period)
            .Include(o => o.EidDayPeriod).ThenInclude(p => p.EidDay)
            .Include(o => o.Items).ThenInclude(i => i.ProductPrice).ThenInclude(pp => pp.Product)
            .Include(o => o.Items).ThenInclude(i => i.ProductPrice).ThenInclude(pp => pp.Size)
            .Include(o => o.Items).ThenInclude(i => i.ProductPrice).ThenInclude(pp => pp.Portion)
            .Include(o => o.Items).ThenInclude(i => i.PlateType)
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.OrderId == orderId);

        if (order == null)
            return NotFound(ApiResponse<object>.ErrorResponse("الطلب غير موجود"));

        var invoice = new
        {
            InvoiceNumber = order.OrderId,
            Customer = new { order.Customer.Name, order.Customer.Phone },
            Address = order.Address != null ? $"{order.Address.Area.NameAr} - {order.Address.AddressDetails}" : "استلام من الفرن",
            Day = order.EidDayPeriod.EidDay.NameAr,
            Period = order.EidDayPeriod.DayPeriodCategory.Period.NameAr,
            DeliveryDate = order.DeliveryDate?.ToString("yyyy-MM-dd"),
            DeliveryTime = order.DeliveryTime?.ToString(@"hh\:mm"),
            Items = order.Items.Select(i => new
            {
                Product = i.ProductPrice.Product.NameAr,
                Size = i.ProductPrice.Size?.NameAr,
                Portion = i.ProductPrice.Portion?.NameAr,
                PlateType = i.PlateType?.NameAr,
                i.Quantity,
                i.UnitPrice,
                i.TotalPrice,
                i.Notes
            }),
            order.Subtotal,
            order.DeliveryCost,
            order.TotalCost,
            order.PaidAmount,
            order.RemainingAmount,
            order.PaymentStatus,
            order.Status,
            order.Notes,
            CreatedAt = order.CreatedAt.ToString("yyyy-MM-dd HH:mm")
        };

        return Ok(ApiResponse<object>.SuccessResponse(invoice));
    }

    // 2. فاتورة المطبخ (Kitchen Report)
    [HttpGet("kitchen")]
    public async Task<ActionResult<ApiResponse<object>>> GetKitchenReport([FromQuery] int? eidDayId, [FromQuery] int? periodId)
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
            return Ok(ApiResponse<object>.SuccessResponse(new { Categories = new List<object>(), Plates = new List<object>(), TotalOrders = 0 }));

        var query = _context.OrderItems
            .Include(i => i.Order).ThenInclude(o => o.EidDayPeriod).ThenInclude(p => p.DayPeriodCategory).ThenInclude(dpc => dpc.Period)
            .Include(i => i.ProductPrice).ThenInclude(pp => pp.Product).ThenInclude(p => p.Category)
            .Include(i => i.ProductPrice).ThenInclude(pp => pp.Size)
            .Include(i => i.PlateType)
            .Where(i => i.Order.EidDayPeriod.EidDayId == targetDayId.Value && i.Order.Status != "cancelled")
            .AsQueryable();

        if (periodId.HasValue)
            query = query.Where(i => i.Order.EidDayPeriodId == periodId.Value);

        var items = await query.ToListAsync();

        // Group by category
        var byCategory = items
            .GroupBy(i => i.ProductPrice.Product.Category.NameAr)
            .Select(g => new
            {
                Category = g.Key,
                Products = g.GroupBy(x => new { ProductName = x.ProductPrice.Product.NameAr, SizeName = x.ProductPrice.Size?.NameAr })
                    .Select(pg => new
                    {
                        Product = pg.Key.ProductName,
                        Size = pg.Key.SizeName,
                        Total = pg.Sum(x => x.Quantity)
                    })
            });

        // Plates summary
        var plates = items
            .Where(i => i.PlateTypeId != null)
            .GroupBy(i => i.PlateType!.NameAr)
            .Select(g => new { PlateType = g.Key, Count = g.Sum(x => x.Quantity) });

        return Ok(ApiResponse<object>.SuccessResponse(new
        {
            EidDayId = targetDayId.Value,
            Categories = byCategory,
            Plates = plates,
            TotalOrders = items.Select(i => i.OrderId).Distinct().Count()
        }));
    }

    // 3. تقرير الإدارة (Management Report)
    [Authorize(Roles = "admin")]
    [HttpGet("management")]
    public async Task<ActionResult<ApiResponse<object>>> GetManagementReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var start = startDate ?? DateTime.Today.AddDays(-30);
        var end = endDate ?? DateTime.Today;

        var orders = await _context.Orders
            .Include(o => o.EidDayPeriod).ThenInclude(p => p.DayPeriodCategory).ThenInclude(dpc => dpc.Period)
            .Include(o => o.Items).ThenInclude(i => i.ProductPrice).ThenInclude(pp => pp.Product).ThenInclude(p => p.Category)
            .Where(o => o.CreatedAt.Date >= start && o.CreatedAt.Date <= end && o.Status != "cancelled")
            .ToListAsync();

        // By day
        var byDay = orders
            .GroupBy(o => o.EidDayPeriod?.EidDay?.NameAr ?? "غير محدد")
            .Select(g => new
            {
                Day = g.Key,
                OrderCount = g.Count(),
                Revenue = g.Sum(o => o.TotalCost),
                ByPeriod = g.GroupBy(o => o.EidDayPeriod?.DayPeriodCategory?.Period?.NameAr ?? "غير محدد")
                    .Select(pg => new { Period = pg.Key, Count = pg.Count(), Total = pg.Sum(o => o.TotalCost) })
            });

        // By category
        var allItems = orders.SelectMany(o => o.Items).ToList();
        var byCategory = allItems
            .GroupBy(i => i.ProductPrice?.Product?.Category?.NameAr ?? "غير محدد")
            .Select(g => new { Category = g.Key, Quantity = g.Sum(i => i.Quantity), Revenue = g.Sum(i => i.TotalPrice) });

        return Ok(ApiResponse<object>.SuccessResponse(new
        {
            Period = new { Start = start.ToString("yyyy-MM-dd"), End = end.ToString("yyyy-MM-dd") },
            TotalOrders = orders.Count,
            TotalRevenue = orders.Sum(o => o.TotalCost),
            ByDay = byDay,
            ByCategory = byCategory
        }));
    }

    // 4. تقرير المالية (Financial Report)
    [Authorize(Roles = "admin")]
    [HttpGet("financial")]
    public async Task<ActionResult<ApiResponse<object>>> GetFinancialReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var start = startDate ?? DateTime.Today.AddDays(-30);
        var end = endDate ?? DateTime.Today;

        var orders = await _context.Orders
            .Where(o => o.CreatedAt.Date >= start && o.CreatedAt.Date <= end && o.Status != "cancelled")
            .ToListAsync();

        var payments = await _context.OrderPayments
            .Include(p => p.Order)
            .Where(p => p.CreatedAt.Date >= start && p.CreatedAt.Date <= end && p.Order.Status != "cancelled")
            .ToListAsync();

        return Ok(ApiResponse<object>.SuccessResponse(new
        {
            Period = new { Start = start.ToString("yyyy-MM-dd"), End = end.ToString("yyyy-MM-dd") },
            TotalInvoices = orders.Count,
            TotalRevenue = orders.Sum(o => o.TotalCost),
            TotalPaid = orders.Sum(o => o.PaidAmount),
            TotalUnpaid = orders.Sum(o => o.RemainingAmount),
            PaymentsByMethod = payments.GroupBy(p => p.PaymentMethod).Select(g => new { Method = g.Key, Amount = g.Sum(p => p.Amount) }),
            ByPaymentStatus = orders.GroupBy(o => o.PaymentStatus).Select(g => new { Status = g.Key, Count = g.Count(), Amount = g.Sum(o => o.TotalCost) })
        }));
    }

    // 5. تقرير المواصلات (Delivery Report)
    [HttpGet("delivery")]
    public async Task<ActionResult<ApiResponse<object>>> GetDeliveryReport([FromQuery] int? eidDayId, [FromQuery] int? periodId)
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
            return Ok(ApiResponse<object>.SuccessResponse(new { ByArea = new List<object>() }));

        var query = _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Address).ThenInclude(a => a.Area)
            .Include(o => o.EidDayPeriod).ThenInclude(p => p.DayPeriodCategory).ThenInclude(dpc => dpc.Period)
            .Where(o => o.EidDayPeriod.EidDayId == targetDayId.Value && o.Status != "cancelled" && o.AddressId != null)
            .AsQueryable();

        if (periodId.HasValue)
            query = query.Where(o => o.EidDayPeriodId == periodId.Value);

        var orders = await query.OrderBy(o => o.Address!.Area.SortOrder).ToListAsync();

        var byArea = orders
            .GroupBy(o => o.Address!.Area.NameAr)
            .Select(g => new
            {
                Area = g.Key,
                Orders = g.Select(o => new
                {
                    o.OrderId,
                    CustomerName = o.Customer.Name,
                    CustomerPhone = o.Customer.Phone,
                    Address = o.Address!.AddressDetails,
                    Period = o.EidDayPeriod.DayPeriodCategory.Period.NameAr,
                    DeliveryTime = o.DeliveryTime?.ToString(@"hh\:mm"),
                    o.TotalCost,
                    o.RemainingAmount
                })
            });

        return Ok(ApiResponse<object>.SuccessResponse(new { EidDayId = targetDayId.Value, ByArea = byArea }));
    }

    // 6. فاتورة التسليم (Delivery Invoice)
    [HttpGet("delivery-invoice/{orderId}")]
    public async Task<ActionResult<ApiResponse<object>>> GetDeliveryInvoice(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Address).ThenInclude(a => a.Area)
            .Include(o => o.Items).ThenInclude(i => i.ProductPrice).ThenInclude(pp => pp.Product)
            .Include(o => o.Items).ThenInclude(i => i.ProductPrice).ThenInclude(pp => pp.Size)
            .Include(o => o.Items).ThenInclude(i => i.PlateType)
            .FirstOrDefaultAsync(o => o.OrderId == orderId);

        if (order == null)
            return NotFound(ApiResponse<object>.ErrorResponse("الطلب غير موجود"));

        var invoice = new
        {
            InvoiceNumber = order.OrderId,
            Customer = new { order.Customer.Name, order.Customer.Phone },
            Address = order.Address != null ? $"{order.Address.Area.NameAr} - {order.Address.AddressDetails}" : "استلام",
            Items = order.Items.Select(i => new
            {
                Product = i.ProductPrice.Product.NameAr,
                Size = i.ProductPrice.Size?.NameAr,
                PlateType = i.PlateType?.NameAr,
                i.Quantity,
                i.TotalPrice,
                Checked = false // For checkbox
            }),
            order.TotalCost,
            order.RemainingAmount,
            ReviewerName = "" // To be filled manually
        };

        return Ok(ApiResponse<object>.SuccessResponse(invoice));
    }

    // 7. معلومات العملاء (Customers Info Report)
    [HttpGet("customers-info")]
    public async Task<ActionResult<ApiResponse<object>>> GetCustomersInfoReport([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var start = startDate ?? DateTime.Today.AddDays(-30);
        var end = endDate ?? DateTime.Today;

        var customers = await _context.Customers
            .Include(c => c.Orders)
            .Where(c => c.CreatedAt.Date >= start && c.CreatedAt.Date <= end)
            .ToListAsync();

        var result = customers.Select(c => new
        {
            c.Name,
            c.Phone,
            IsNewCustomer = !c.Orders.Any(o => o.CreatedAt < start),
            HasBooking = c.Orders.Any(o => o.Status != "cancelled"),
            ServiceStatus = c.ServiceStatus,
            OrderCount = c.Orders.Count(o => o.Status != "cancelled"),
            TotalSpent = c.Orders.Where(o => o.Status != "cancelled").Sum(o => o.TotalCost)
        });

        return Ok(ApiResponse<object>.SuccessResponse(new
        {
            Period = new { Start = start.ToString("yyyy-MM-dd"), End = end.ToString("yyyy-MM-dd") },
            TotalCustomers = customers.Count,
            NewCustomers = result.Count(c => c.IsNewCustomer),
            WithBooking = result.Count(c => c.HasBooking),
            WithoutBooking = result.Count(c => !c.HasBooking),
            Customers = result
        }));
    }
}
