using EidSystem.API.Models.Entities;

namespace EidSystem.API.Repositories.Interfaces;

public interface ICustomerRepository : IGenericRepository<Customer>
{
    Task<Customer?> GetByPhoneAsync(string phone);
    Task<Customer?> GetWithAddressesAsync(int id);
    Task<Customer?> GetWithOrdersAsync(int id);
    Task<IEnumerable<Customer>> SearchAsync(string searchTerm);
}
