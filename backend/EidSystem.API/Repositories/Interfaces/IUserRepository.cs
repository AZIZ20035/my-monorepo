using EidSystem.API.Models.Entities;

namespace EidSystem.API.Repositories.Interfaces;

public interface IUserRepository : IGenericRepository<User>
{
    Task<User?> GetByUsernameAsync(string username);
    Task<IEnumerable<User>> GetByRoleAsync(string role);
    Task<IEnumerable<User>> GetActiveUsersAsync();
}
