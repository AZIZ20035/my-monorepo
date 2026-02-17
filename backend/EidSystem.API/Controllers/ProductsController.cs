using EidSystem.API.Models.DTOs.Requests;
using EidSystem.API.Models.DTOs.Responses;
using EidSystem.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EidSystem.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductResponse>>>> GetAll([FromQuery] int? categoryId)
    {
        var result = categoryId.HasValue 
            ? await _productService.GetByCategoryAsync(categoryId.Value)
            : await _productService.GetAllAsync();
        return Ok(ApiResponse<IEnumerable<ProductResponse>>.SuccessResponse(result));
    }

    [HttpGet("category/{categoryId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductResponse>>>> GetByCategory(int categoryId)
    {
        var result = await _productService.GetByCategoryAsync(categoryId);
        return Ok(ApiResponse<IEnumerable<ProductResponse>>.SuccessResponse(result));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ProductResponse>>> GetById(int id)
    {
        var result = await _productService.GetByIdAsync(id);
        return Ok(ApiResponse<ProductResponse>.SuccessResponse(result));
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProductResponse>>> Create([FromBody] CreateProductRequest request)
    {
        var result = await _productService.CreateAsync(request);
        return Ok(ApiResponse<ProductResponse>.SuccessResponse(result, "تم إنشاء المنتج بنجاح"));
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<ProductResponse>>> Update(int id, [FromBody] UpdateProductRequest request)
    {
        var result = await _productService.UpdateAsync(id, request);
        return Ok(ApiResponse<ProductResponse>.SuccessResponse(result, "تم تحديث المنتج بنجاح"));
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        await _productService.DeleteAsync(id);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "تم حذف المنتج بنجاح"));
    }

    // Product Prices
    [HttpGet("{productId}/prices")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductPriceResponse>>>> GetProductPrices(int productId)
    {
        var product = await _productService.GetByIdAsync(productId);
        return Ok(ApiResponse<IEnumerable<ProductPriceResponse>>.SuccessResponse(product.Prices));
    }

    [Authorize(Roles = "admin")]
    [HttpPost("{productId}/prices")]
    public async Task<ActionResult<ApiResponse<ProductPriceResponse>>> AddPrice(int productId, [FromBody] CreateProductPriceRequest request)
    {
        var result = await _productService.AddPriceAsync(productId, request);
        return Ok(ApiResponse<ProductPriceResponse>.SuccessResponse(result, "تم إضافة السعر بنجاح"));
    }

    [Authorize(Roles = "admin")]
    [HttpPut("prices/{priceId}")]
    public async Task<ActionResult<ApiResponse<ProductPriceResponse>>> UpdatePrice(int priceId, [FromBody] UpdateProductPriceRequest request)
    {
        var result = await _productService.UpdatePriceAsync(priceId, request);
        return Ok(ApiResponse<ProductPriceResponse>.SuccessResponse(result, "تم تحديث السعر بنجاح"));
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("prices/{priceId}")]
    public async Task<ActionResult<ApiResponse<object>>> DeletePrice(int priceId)
    {
        await _productService.DeletePriceAsync(priceId);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "تم حذف السعر بنجاح"));
    }

    // Sizes
    [HttpGet("sizes")]
    public async Task<ActionResult<ApiResponse<IEnumerable<SizeResponse>>>> GetSizes()
    {
        var result = await _productService.GetSizesAsync();
        return Ok(ApiResponse<IEnumerable<SizeResponse>>.SuccessResponse(result));
    }

    [Authorize(Roles = "admin")]
    [HttpPost("sizes")]
    public async Task<ActionResult<ApiResponse<SizeResponse>>> CreateSize([FromBody] CreateSizeRequest request)
    {
        var result = await _productService.CreateSizeAsync(request);
        return Ok(ApiResponse<SizeResponse>.SuccessResponse(result, "تم إنشاء الحجم بنجاح"));
    }

    [Authorize(Roles = "admin")]
    [HttpPut("sizes/{id}")]
    public async Task<ActionResult<ApiResponse<SizeResponse>>> UpdateSize(int id, [FromBody] UpdateSizeRequest request)
    {
        var result = await _productService.UpdateSizeAsync(id, request);
        return Ok(ApiResponse<SizeResponse>.SuccessResponse(result, "تم تحديث الحجم بنجاح"));
    }

    // Portions
    [HttpGet("portions")]
    public async Task<ActionResult<ApiResponse<IEnumerable<PortionResponse>>>> GetPortions()
    {
        var result = await _productService.GetPortionsAsync();
        return Ok(ApiResponse<IEnumerable<PortionResponse>>.SuccessResponse(result));
    }

    [Authorize(Roles = "admin")]
    [HttpPost("portions")]
    public async Task<ActionResult<ApiResponse<PortionResponse>>> CreatePortion([FromBody] CreatePortionRequest request)
    {
        var result = await _productService.CreatePortionAsync(request);
        return Ok(ApiResponse<PortionResponse>.SuccessResponse(result, "تم إنشاء الجزء بنجاح"));
    }

    [Authorize(Roles = "admin")]
    [HttpPut("portions/{id}")]
    public async Task<ActionResult<ApiResponse<PortionResponse>>> UpdatePortion(int id, [FromBody] UpdatePortionRequest request)
    {
        var result = await _productService.UpdatePortionAsync(id, request);
        return Ok(ApiResponse<PortionResponse>.SuccessResponse(result, "تم تحديث الجزء بنجاح"));
    }

    // Plate Types
    [HttpGet("plate-types")]
    public async Task<ActionResult<ApiResponse<IEnumerable<PlateTypeResponse>>>> GetPlateTypes()
    {
        var result = await _productService.GetPlateTypesAsync();
        return Ok(ApiResponse<IEnumerable<PlateTypeResponse>>.SuccessResponse(result));
    }

    [Authorize(Roles = "admin")]
    [HttpPost("plate-types")]
    public async Task<ActionResult<ApiResponse<PlateTypeResponse>>> CreatePlateType([FromBody] CreatePlateTypeRequest request)
    {
        var result = await _productService.CreatePlateTypeAsync(request);
        return Ok(ApiResponse<PlateTypeResponse>.SuccessResponse(result, "تم إنشاء نوع الصحن بنجاح"));
    }

    [Authorize(Roles = "admin")]
    [HttpPut("plate-types/{id}")]
    public async Task<ActionResult<ApiResponse<PlateTypeResponse>>> UpdatePlateType(int id, [FromBody] UpdatePlateTypeRequest request)
    {
        var result = await _productService.UpdatePlateTypeAsync(id, request);
        return Ok(ApiResponse<PlateTypeResponse>.SuccessResponse(result, "تم تحديث نوع الصحن بنجاح"));
    }
}
