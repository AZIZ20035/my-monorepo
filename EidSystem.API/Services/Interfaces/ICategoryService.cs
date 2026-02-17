using EidSystem.API.Models.DTOs.Requests;
using EidSystem.API.Models.DTOs.Responses;

namespace EidSystem.API.Services.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryResponse>> GetAllAsync();
    Task<IEnumerable<CategoryResponse>> GetActiveAsync();
    Task<CategoryResponse> GetByIdAsync(int id);
    Task<CategoryResponse> CreateAsync(CreateCategoryRequest request);
    Task<CategoryResponse> UpdateAsync(int id, UpdateCategoryRequest request);
    Task DeleteAsync(int id);
}
