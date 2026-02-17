using EidSystem.API.Models.DTOs.Requests;
using EidSystem.API.Models.DTOs.Responses;

namespace EidSystem.API.Services.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserResponse>> GetAllAsync();
    Task<UserResponse> GetByIdAsync(int id);
    Task<UserResponse> CreateAsync(CreateUserRequest request);
    Task<UserResponse> UpdateAsync(int id, UpdateUserRequest request);
    Task DeleteAsync(int id);
    Task ResetPasswordAsync(int id, string newPassword);
}
