using EidSystem.API.Data;
using EidSystem.API.Models.DTOs.Responses;
using EidSystem.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EidSystem.API.Services.Implementations;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;

    public DashboardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsResponse> GetStatsAsync()
    {
        var today = DateTime.Today;

        return new DashboardStatsResponse
        {
            TotalOrders = await _context.Orders.CountAsync(),
            TodayOrders = await _context.Orders.CountAsync(o => o.CreatedAt.Date == today),
            PendingOrders = await _context.Orders.CountAsync(o => o.Status == "pending"),
            PreparingOrders = await _context.Orders.CountAsync(o => o.Status == "preparing"),
            DeliveredOrders = await _context.Orders.CountAsync(o => o.Status == "delivered"),
            TotalRevenue = await _context.Orders.SumAsync(o => o.TotalCost),
            TodayRevenue = await _context.Orders.Where(o => o.CreatedAt.Date == today).SumAsync(o => o.TotalCost),
            UnpaidAmount = await _context.Orders.SumAsync(o => o.RemainingAmount),
            TotalCustomers = await _context.Customers.CountAsync(),
            NewCustomersToday = await _context.Customers.CountAsync(c => c.CreatedAt.Date == today)
        };
    }

    public async Task<IEnumerable<PeriodAvailabilityResponse>> GetPeriodAvailabilityAsync()
    {
        var periods = await _context.EidDayPeriods
            .Include(edp => edp.EidDay)
            .Include(edp => edp.DayPeriodCategory).ThenInclude(dpc => dpc.Period)
            .Where(edp => edp.IsActive)
            .OrderBy(edp => edp.EidDay.SortOrder)
            .ThenBy(edp => edp.DayPeriodCategory.Period.SortOrder)
            .ToListAsync();

        return periods.Select(p => new PeriodAvailabilityResponse
        {
            EidDayPeriodId = p.EidDayPeriodId,
            DayName = p.EidDay.NameAr,
            PeriodName = p.DayPeriodCategory.Period.NameAr,
            Available = p.AvailableAmount,
            Total = p.MaxCapacity,
            IsFull = p.CurrentOrders >= p.MaxCapacity
        });
    }
}
