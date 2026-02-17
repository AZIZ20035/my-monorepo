using EidSystem.API.Data;
using EidSystem.API.Models.Entities;
using EidSystem.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EidSystem.API.Repositories.Implementations;

public class EidDayPeriodRepository : GenericRepository<EidDayPeriod>, IEidDayPeriodRepository
{
    public EidDayPeriodRepository(AppDbContext context) : base(context)
    {
    }



    public async Task<IEnumerable<EidDayPeriod>> GetAvailableAsync()
    {
        return await _context.EidDayPeriods
            .Include(edp => edp.EidDay)
            .Include(edp => edp.DayPeriodCategory).ThenInclude(dpc => dpc.Period)
            .Include(edp => edp.DayPeriodCategory).ThenInclude(dpc => dpc.Category)
            .Where(edp => edp.IsActive && edp.CurrentOrders < edp.MaxCapacity)
            .OrderBy(edp => edp.EidDay.SortOrder)
            .ThenBy(edp => edp.DayPeriodCategory.Period.SortOrder)
            .ToListAsync();
    }

    public async Task<IEnumerable<EidDayPeriod>> GetByEidDayAsync(int eidDayId)
    {
        return await _context.EidDayPeriods
            .Include(edp => edp.DayPeriodCategory).ThenInclude(dpc => dpc.Period)
            .Include(edp => edp.DayPeriodCategory).ThenInclude(dpc => dpc.Category)
            .Where(edp => edp.EidDayId == eidDayId && edp.IsActive)
            .OrderBy(edp => edp.DayPeriodCategory.Period.SortOrder)
            .ToListAsync();
    }

    public async Task IncrementOrdersAsync(int eidDayPeriodId)
    {
        var period = await _context.EidDayPeriods.FindAsync(eidDayPeriodId);
        if (period != null)
        {
            period.CurrentOrders++;
            await _context.SaveChangesAsync();
        }
    }

    public async Task DecrementOrdersAsync(int eidDayPeriodId)
    {
        var period = await _context.EidDayPeriods.FindAsync(eidDayPeriodId);
        if (period != null && period.CurrentOrders > 0)
        {
            period.CurrentOrders--;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<EidDayPeriod?> GetWithDetailsAsync(int id)
    {
        return await _context.EidDayPeriods
            .Include(edp => edp.EidDay)
            .Include(edp => edp.DayPeriodCategory).ThenInclude(dpc => dpc.Period)
            .Include(edp => edp.DayPeriodCategory).ThenInclude(dpc => dpc.Category)
            .FirstOrDefaultAsync(edp => edp.EidDayPeriodId == id);
    }
}
