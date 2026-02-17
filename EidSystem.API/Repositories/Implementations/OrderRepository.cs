using EidSystem.API.Data;
using EidSystem.API.Models.Entities;
using EidSystem.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EidSystem.API.Repositories.Implementations;

public class OrderRepository : GenericRepository<Order>, IOrderRepository
{
    public OrderRepository(AppDbContext context) : base(context)
    {
    }

    public override async Task<Order?> GetByIdAsync(int id)
    {
        return await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Address)
                .ThenInclude(a => a!.Area)
            .Include(o => o.Items)
                .ThenInclude(i => i.ProductPrice)
                    .ThenInclude(pp => pp.Product)
            .Include(o => o.Items)
                .ThenInclude(i => i.PlateType)
            .Include(o => o.EidDayPeriod)
                .ThenInclude(edp => edp.DayPeriodCategory)
                    .ThenInclude(dpc => dpc.Period)
            .Include(o => o.EidDayPeriod)
                .ThenInclude(edp => edp.EidDay)
            .Include(o => o.Payments)
            .Include(o => o.CreatedByUser)
            .FirstOrDefaultAsync(o => o.OrderId == id);
    }



    public async Task<IEnumerable<Order>> GetByEidDayAsync(int eidDayId)
    {
        return await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.EidDayPeriod)
                .ThenInclude(edp => edp.DayPeriodCategory)
                    .ThenInclude(dpc => dpc.Period)
            .Include(o => o.EidDayPeriod)
                .ThenInclude(edp => edp.EidDay)
            .Include(o => o.Items)
            .Where(o => o.EidDayPeriod.EidDayId == eidDayId)
            .OrderBy(o => o.DeliveryTime)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetByPeriodAsync(int eidDayPeriodId)
    {
        return await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.EidDayPeriod)
                .ThenInclude(edp => edp.DayPeriodCategory)
                    .ThenInclude(dpc => dpc.Period)
            .Include(o => o.EidDayPeriod)
                .ThenInclude(edp => edp.EidDay)
            .Include(o => o.Items)
                .ThenInclude(i => i.ProductPrice)
                    .ThenInclude(pp => pp.Product)
            .Where(o => o.EidDayPeriodId == eidDayPeriodId)
            .OrderBy(o => o.OrderId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetByCustomerAsync(int customerId)
    {
        return await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .Include(o => o.EidDayPeriod)
                .ThenInclude(edp => edp.DayPeriodCategory)
                    .ThenInclude(dpc => dpc.Period)
            .Include(o => o.EidDayPeriod)
                .ThenInclude(edp => edp.EidDay)
            .Where(o => o.CustomerId == customerId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetByStatusAsync(string status)
    {
        return await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.EidDayPeriod)
                .ThenInclude(edp => edp.DayPeriodCategory)
                    .ThenInclude(dpc => dpc.Period)
            .Include(o => o.EidDayPeriod)
                .ThenInclude(edp => edp.EidDay)
            .Include(o => o.Items)
            .Where(o => o.Status == status)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }



    public async Task<Order?> GetWithDetailsAsync(int id)
    {
        return await GetByIdAsync(id);
    }

    public async Task<IEnumerable<Order>> GetTodayOrdersAsync()
    {
        // Pick the current active EidDay based on date or just pick the first active one
        var today = DateTime.Today;
        var eidDay = await _context.EidDays.FirstOrDefaultAsync(d => d.Date.Date == today && d.IsActive)
                     ?? await _context.EidDays.OrderBy(d => d.SortOrder).FirstOrDefaultAsync(d => d.IsActive);

        if (eidDay == null) return new List<Order>();

        return await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.EidDayPeriod)
                .ThenInclude(edp => edp.DayPeriodCategory)
                    .ThenInclude(dpc => dpc.Period)
            .Include(o => o.Items)
            .Where(o => o.EidDayPeriod.EidDayId == eidDay.EidDayId)
            .OrderBy(o => o.DeliveryTime)
            .ToListAsync();
    }

    public async Task<decimal> GetTotalRevenueAsync(DateTime? startDate, DateTime? endDate)
    {
        var query = _context.Orders.AsQueryable();

        if (startDate.HasValue)
            query = query.Where(o => o.CreatedAt >= startDate.Value);
        
        if (endDate.HasValue)
            query = query.Where(o => o.CreatedAt <= endDate.Value);

        return await query.SumAsync(o => o.TotalCost);
    }
}
