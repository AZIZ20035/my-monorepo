using EidSystem.API.Models.Entities;

namespace EidSystem.API.Repositories.Interfaces;

public interface IActivityLogRepository : IGenericRepository<ActivityLog>
{
    Task LogAsync(int userId, string action, string entityType, int entityId, object? oldValues, object? newValues);
    Task<IEnumerable<ActivityLog>> GetByUserAsync(int userId);
    Task<IEnumerable<ActivityLog>> GetByEntityAsync(string entityType, int entityId);
}
