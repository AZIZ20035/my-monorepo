using EidSystem.API.Models.Entities;

namespace EidSystem.API.Repositories.Interfaces;

public interface IAreaRepository : IGenericRepository<Area>
{
    Task<IEnumerable<Area>> GetActiveAsync();
}
