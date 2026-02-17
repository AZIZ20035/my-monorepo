using EidSystem.API.Exceptions;
using EidSystem.API.Models.DTOs.Requests;
using EidSystem.API.Models.DTOs.Responses;
using EidSystem.API.Models.Entities;
using EidSystem.API.Repositories.Interfaces;
using EidSystem.API.Services.Interfaces;

namespace EidSystem.API.Services.Implementations;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<CategoryResponse>> GetAllAsync()
    {
        var categories = await _categoryRepository.GetAllAsync();
        return categories.Select(MapToResponse);
    }

    public async Task<IEnumerable<CategoryResponse>> GetActiveAsync()
    {
        var categories = await _categoryRepository.GetActiveAsync();
        return categories.Select(MapToResponse);
    }

    public async Task<CategoryResponse> GetByIdAsync(int id)
    {
        var category = await _categoryRepository.GetWithProductsAsync(id);
        if (category == null)
            throw new NotFoundException("Category", id);
        return MapToResponse(category);
    }

    public async Task<CategoryResponse> CreateAsync(CreateCategoryRequest request)
    {
        var category = new Category
        {
            NameAr = request.NameAr,
            NameEn = request.NameEn,
            Description = request.Description,
            SortOrder = request.SortOrder,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _categoryRepository.AddAsync(category);
        return MapToResponse(category);
    }

    public async Task<CategoryResponse> UpdateAsync(int id, UpdateCategoryRequest request)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null)
            throw new NotFoundException("Category", id);

        if (request.NameAr != null) category.NameAr = request.NameAr;
        if (request.NameEn != null) category.NameEn = request.NameEn;
        if (request.Description != null) category.Description = request.Description;
        if (request.IsActive.HasValue) category.IsActive = request.IsActive.Value;
        if (request.SortOrder.HasValue) category.SortOrder = request.SortOrder.Value;
        category.UpdatedAt = DateTime.UtcNow;

        await _categoryRepository.UpdateAsync(category);
        return MapToResponse(category);
    }

    public async Task DeleteAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null)
            throw new NotFoundException("Category", id);

        category.IsActive = false;
        category.UpdatedAt = DateTime.UtcNow;
        await _categoryRepository.UpdateAsync(category);
    }

    private static CategoryResponse MapToResponse(Category c) => new()
    {
        CategoryId = c.CategoryId,
        NameAr = c.NameAr,
        NameEn = c.NameEn,
        Description = c.Description,
        IsActive = c.IsActive,
        SortOrder = c.SortOrder,
        ProductCount = c.Products?.Count ?? 0
    };
}
