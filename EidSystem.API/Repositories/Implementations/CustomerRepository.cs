using EidSystem.API.Data;
using EidSystem.API.Models.Entities;
using EidSystem.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EidSystem.API.Repositories.Implementations;

public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
{
    public CustomerRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Customer?> GetByPhoneAsync(string phone)
    {
        return await _context.Customers
            .Include(c => c.Addresses)
                .ThenInclude(a => a.Area)
            .FirstOrDefaultAsync(c => c.Phone == phone || c.Phone2 == phone);
    }

    public async Task<Customer?> GetWithAddressesAsync(int id)
    {
        return await _context.Customers
            .Include(c => c.Addresses)
                .ThenInclude(a => a.Area)
            .FirstOrDefaultAsync(c => c.CustomerId == id);
    }

    public async Task<Customer?> GetWithOrdersAsync(int id)
    {
        return await _context.Customers
            .Include(c => c.Orders)
                .ThenInclude(o => o.Items)
            .Include(c => c.Addresses)
                .ThenInclude(a => a.Area)
            .FirstOrDefaultAsync(c => c.CustomerId == id);
    }

    public async Task<IEnumerable<Customer>> SearchAsync(string searchTerm)
    {
        return await _context.Customers
            .Where(c => c.Name.Contains(searchTerm) || 
                       c.Phone.Contains(searchTerm) ||
                       (c.Phone2 != null && c.Phone2.Contains(searchTerm)))
            .Include(c => c.Addresses)
                .ThenInclude(a => a.Area)
            .OrderByDescending(c => c.CreatedAt)
            .Take(20)
            .ToListAsync();
    }
}
