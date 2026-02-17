using EidSystem.API.Models.Entities;

namespace EidSystem.API.Repositories.Interfaces;

public interface IEidDayPeriodRepository : IGenericRepository<EidDayPeriod>
{

    Task<IEnumerable<EidDayPeriod>> GetAvailableAsync();
    Task<IEnumerable<EidDayPeriod>> GetByEidDayAsync(int eidDayId);
    Task IncrementOrdersAsync(int eidDayPeriodId);
    Task DecrementOrdersAsync(int eidDayPeriodId);
    Task<EidDayPeriod?> GetWithDetailsAsync(int id);
}
