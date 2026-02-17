using EidSystem.API.Data;
using EidSystem.API.Models.Entities;
using EidSystem.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EidSystem.API.Repositories.Implementations;

public class AreaRepository : GenericRepository<Area>, IAreaRepository
{
    public AreaRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Area>> GetActiveAsync()
    {
        return await _context.Areas
            .Where(a => a.IsActive)
            .OrderBy(a => a.SortOrder)
            .ToListAsync();
    }
}
