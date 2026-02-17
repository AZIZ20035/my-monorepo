using EidSystem.API.Models.DTOs.Requests;
using EidSystem.API.Models.DTOs.Responses;

namespace EidSystem.API.Services.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductResponse>> GetAllAsync();
    Task<IEnumerable<ProductResponse>> GetByCategoryAsync(int categoryId);
    Task<ProductResponse> GetByIdAsync(int id);
    Task<ProductResponse> CreateAsync(CreateProductRequest request);
    Task<ProductResponse> UpdateAsync(int id, UpdateProductRequest request);
    Task DeleteAsync(int id);
    
    // Prices
    Task<ProductPriceResponse> AddPriceAsync(int productId, CreateProductPriceRequest request);
    Task<ProductPriceResponse> UpdatePriceAsync(int priceId, UpdateProductPriceRequest request);
    Task DeletePriceAsync(int priceId);

    // Sizes
    Task<IEnumerable<SizeResponse>> GetSizesAsync();
    Task<SizeResponse> CreateSizeAsync(CreateSizeRequest request);
    Task<SizeResponse> UpdateSizeAsync(int id, UpdateSizeRequest request);
    
    // Portions
    Task<IEnumerable<PortionResponse>> GetPortionsAsync();
    Task<PortionResponse> CreatePortionAsync(CreatePortionRequest request);
    Task<PortionResponse> UpdatePortionAsync(int id, UpdatePortionRequest request);
    
    // Plate Types
    Task<IEnumerable<PlateTypeResponse>> GetPlateTypesAsync();
    Task<PlateTypeResponse> CreatePlateTypeAsync(CreatePlateTypeRequest request);
    Task<PlateTypeResponse> UpdatePlateTypeAsync(int id, UpdatePlateTypeRequest request);
}

