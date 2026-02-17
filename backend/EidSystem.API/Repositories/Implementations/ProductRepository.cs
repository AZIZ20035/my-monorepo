using EidSystem.API.Data;
using EidSystem.API.Models.Entities;
using EidSystem.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EidSystem.API.Repositories.Implementations;

public class ProductRepository : GenericRepository<Product>, IProductRepository
{
    public ProductRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Product>> GetByCategoryAsync(int categoryId)
    {
        return await _context.Products
            .Where(p => p.CategoryId == categoryId && p.IsActive)
            .Include(p => p.Prices.Where(pr => pr.IsActive))
                .ThenInclude(pr => pr.Size)
            .Include(p => p.Prices.Where(pr => pr.IsActive))
                .ThenInclude(pr => pr.Portion)
            .Include(p => p.ProductPlates)
                .ThenInclude(pp => pp.PlateType)
            .OrderBy(p => p.SortOrder)
            .ToListAsync();
    }

    public async Task<Product?> GetWithPricesAsync(int id)
    {
        return await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Prices.Where(pr => pr.IsActive))
                .ThenInclude(pr => pr.Size)
            .Include(p => p.Prices.Where(pr => pr.IsActive))
                .ThenInclude(pr => pr.Portion)
            .Include(p => p.ProductPlates)
                .ThenInclude(pp => pp.PlateType)
            .FirstOrDefaultAsync(p => p.ProductId == id);
    }

    public async Task<IEnumerable<Product>> GetActiveAsync()
    {
        return await _context.Products
            .Where(p => p.IsActive)
            .Include(p => p.Category)
            .Include(p => p.Prices.Where(pr => pr.IsActive))
                .ThenInclude(pr => pr.Size)
            .Include(p => p.Prices.Where(pr => pr.IsActive))
                .ThenInclude(pr => pr.Portion)
            .Include(p => p.ProductPlates)
                .ThenInclude(pp => pp.PlateType)
            .OrderBy(p => p.Category.SortOrder)
            .ThenBy(p => p.SortOrder)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetWithPlatesAsync(int id)
    {
        return await _context.Products
            .Where(p => p.ProductId == id)
            .Include(p => p.ProductPlates)
                .ThenInclude(pp => pp.PlateType)
            .ToListAsync();
    }
}
