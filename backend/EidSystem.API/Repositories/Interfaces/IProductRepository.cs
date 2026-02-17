using EidSystem.API.Models.Entities;

namespace EidSystem.API.Repositories.Interfaces;

public interface IProductRepository : IGenericRepository<Product>
{
    Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId);
    Task<Product?> GetWithPricesAsync(int id);
    Task<IEnumerable<Product>> GetActiveAsync();
    Task<IEnumerable<Product>> GetWithPlatesAsync(int id);
}
