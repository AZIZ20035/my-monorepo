using EidSystem.API.Models.Entities;

namespace EidSystem.API.Repositories.Interfaces;

public interface ICategoryRepository : IGenericRepository<Category>
{
    Task<IEnumerable<Category>> GetActiveAsync();
    Task<Category?> GetWithProductsAsync(int id);
}
