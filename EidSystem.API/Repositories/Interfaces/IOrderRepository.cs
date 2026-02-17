using EidSystem.API.Models.Entities;

namespace EidSystem.API.Repositories.Interfaces;

public interface IOrderRepository : IGenericRepository<Order>
{

    Task<IEnumerable<Order>> GetByEidDayAsync(int eidDayId);
    Task<IEnumerable<Order>> GetByPeriodAsync(int eidDayPeriodId);
    Task<IEnumerable<Order>> GetByCustomerAsync(int customerId);
    Task<IEnumerable<Order>> GetByStatusAsync(string status);

    Task<Order?> GetWithDetailsAsync(int id);
    Task<IEnumerable<Order>> GetTodayOrdersAsync();
    Task<decimal> GetTotalRevenueAsync(DateTime? startDate, DateTime? endDate);
}
