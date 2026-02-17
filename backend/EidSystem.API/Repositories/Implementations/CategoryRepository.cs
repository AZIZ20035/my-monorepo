using EidSystem.API.Data;
using EidSystem.API.Models.Entities;
using EidSystem.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EidSystem.API.Repositories.Implementations;

public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
{
    public CategoryRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Category>> GetActiveAsync()
    {
        return await _context.Categories
            .Where(c => c.IsActive)
            .Include(c => c.Products)
            .OrderBy(c => c.SortOrder)
            .ToListAsync();
    }

    public async Task<Category?> GetWithProductsAsync(int id)
    {
        return await _context.Categories
            .Include(c => c.Products.Where(p => p.IsActive))
            .FirstOrDefaultAsync(c => c.CategoryId == id);
    }
}
