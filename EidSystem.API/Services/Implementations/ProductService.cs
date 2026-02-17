using EidSystem.API.Data;
using EidSystem.API.Exceptions;
using EidSystem.API.Models.DTOs.Requests;
using EidSystem.API.Models.DTOs.Responses;
using EidSystem.API.Models.Entities;
using EidSystem.API.Repositories.Interfaces;
using EidSystem.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EidSystem.API.Services.Implementations;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly AppDbContext _context;

    public ProductService(IProductRepository productRepository, AppDbContext context)
    {
        _productRepository = productRepository;
        _context = context;
    }

    public async Task<IEnumerable<ProductResponse>> GetAllAsync()
    {
        var products = await _productRepository.GetActiveAsync();
        return products.Select(MapToResponse);
    }

    public async Task<IEnumerable<ProductResponse>> GetByCategoryAsync(int categoryId)
    {
        var products = await _productRepository.GetByCategoryAsync(categoryId);
        return products.Select(MapToResponse);
    }

    public async Task<ProductResponse> GetByIdAsync(int id)
    {
        var product = await _productRepository.GetWithPricesAsync(id);
        if (product == null)
            throw new NotFoundException("Product", id);
        return MapToResponse(product);
    }

    public async Task<ProductResponse> CreateAsync(CreateProductRequest request)
    {
        var product = new Product
        {
            CategoryId = request.CategoryId,
            NameAr = request.NameAr,
            NameEn = request.NameEn,
            Description = request.Description,
            PlateOption = request.PlateOption,
            SortOrder = request.SortOrder,
            IsActive = true,
            CreatedAt = DateTime.Now
        };

        await _productRepository.AddAsync(product);

        // Add prices
        foreach (var price in request.Prices)
        {
            var productPrice = new ProductPrice
            {
                ProductId = product.ProductId,
                SizeId = price.SizeId,
                PortionId = price.PortionId,
                Price = price.Price,
                IsActive = true,
                CreatedAt = DateTime.Now
            };
            _context.ProductPrices.Add(productPrice);
        }

        // Add plate types
        foreach (var plateTypeId in request.PlateTypeIds)
        {
            var productPlate = new ProductPlate
            {
                ProductId = product.ProductId,
                PlateTypeId = plateTypeId
            };
            _context.ProductPlates.Add(productPlate);
        }

        await _context.SaveChangesAsync();

        return await GetByIdAsync(product.ProductId);
    }

    public async Task<ProductResponse> UpdateAsync(int id, UpdateProductRequest request)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
            throw new NotFoundException("Product", id);

        if (request.CategoryId.HasValue) product.CategoryId = request.CategoryId.Value;
        if (request.NameAr != null) product.NameAr = request.NameAr;
        if (request.NameEn != null) product.NameEn = request.NameEn;
        if (request.Description != null) product.Description = request.Description;
        if (request.PlateOption != null) product.PlateOption = request.PlateOption;
        if (request.IsActive.HasValue) product.IsActive = request.IsActive.Value;
        if (request.SortOrder.HasValue) product.SortOrder = request.SortOrder.Value;
        product.UpdatedAt = DateTime.Now;

        await _productRepository.UpdateAsync(product);
        return await GetByIdAsync(id);
    }

    public async Task DeleteAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
            throw new NotFoundException("Product", id);

        product.IsActive = false;
        product.UpdatedAt = DateTime.Now;
        await _productRepository.UpdateAsync(product);
    }

    // Prices
    public async Task<ProductPriceResponse> AddPriceAsync(int productId, CreateProductPriceRequest request)
    {
        var product = await _productRepository.GetByIdAsync(productId);
        if (product == null)
            throw new NotFoundException("Product", productId);

        var price = new ProductPrice
        {
            ProductId = productId,
            SizeId = request.SizeId,
            PortionId = request.PortionId,
            Price = request.Price,
            IsActive = true,
            CreatedAt = DateTime.Now
        };

        _context.ProductPrices.Add(price);
        await _context.SaveChangesAsync();

        return MapPriceToResponse(price);
    }

    public async Task<ProductPriceResponse> UpdatePriceAsync(int priceId, UpdateProductPriceRequest request)
    {
        var price = await _context.ProductPrices.FindAsync(priceId);
        if (price == null)
            throw new NotFoundException("ProductPrice", priceId);

        if (request.Price.HasValue) price.Price = request.Price.Value;
        if (request.IsActive.HasValue) price.IsActive = request.IsActive.Value;
        price.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();
        return MapPriceToResponse(price);
    }

    public async Task DeletePriceAsync(int priceId)
    {
        var price = await _context.ProductPrices.FindAsync(priceId);
        if (price == null)
            throw new NotFoundException("ProductPrice", priceId);

        price.IsActive = false;
        price.UpdatedAt = DateTime.Now;
        await _context.SaveChangesAsync();
    }

    // Sizes
    public async Task<IEnumerable<SizeResponse>> GetSizesAsync()
    {
        var sizes = await _context.Sizes.Where(s => s.IsActive).OrderBy(s => s.SortOrder).ToListAsync();
        return sizes.Select(s => new SizeResponse
        {
            SizeId = s.SizeId,
            NameAr = s.NameAr,
            NameEn = s.NameEn,
            IsActive = s.IsActive,
            SortOrder = s.SortOrder
        });
    }

    public async Task<SizeResponse> CreateSizeAsync(CreateSizeRequest request)
    {
        var size = new Size
        {
            NameAr = request.NameAr,
            NameEn = request.NameEn,
            SortOrder = request.SortOrder,
            IsActive = true
        };
        _context.Sizes.Add(size);
        await _context.SaveChangesAsync();

        return new SizeResponse
        {
            SizeId = size.SizeId,
            NameAr = size.NameAr,
            NameEn = size.NameEn,
            IsActive = size.IsActive,
            SortOrder = size.SortOrder
        };
    }

    // Portions
    public async Task<IEnumerable<PortionResponse>> GetPortionsAsync()
    {
        var portions = await _context.Portions.Where(p => p.IsActive).OrderBy(p => p.SortOrder).ToListAsync();
        return portions.Select(p => new PortionResponse
        {
            PortionId = p.PortionId,
            NameAr = p.NameAr,
            NameEn = p.NameEn,
            Multiplier = p.Multiplier,
            IsActive = p.IsActive,
            SortOrder = p.SortOrder
        });
    }

    public async Task<PortionResponse> CreatePortionAsync(CreatePortionRequest request)
    {
        var portion = new Portion
        {
            NameAr = request.NameAr,
            NameEn = request.NameEn,
            Multiplier = request.Multiplier,
            SortOrder = request.SortOrder,
            IsActive = true
        };
        _context.Portions.Add(portion);
        await _context.SaveChangesAsync();

        return new PortionResponse
        {
            PortionId = portion.PortionId,
            NameAr = portion.NameAr,
            NameEn = portion.NameEn,
            Multiplier = portion.Multiplier,
            IsActive = portion.IsActive,
            SortOrder = portion.SortOrder
        };
    }

    // Plate Types
    public async Task<IEnumerable<PlateTypeResponse>> GetPlateTypesAsync()
    {
        var plates = await _context.PlateTypes.Where(p => p.IsActive).OrderBy(p => p.SortOrder).ToListAsync();
        return plates.Select(p => new PlateTypeResponse
        {
            PlateTypeId = p.PlateTypeId,
            NameAr = p.NameAr,
            NameEn = p.NameEn,
            IsActive = p.IsActive,
            SortOrder = p.SortOrder
        });
    }

    public async Task<PlateTypeResponse> CreatePlateTypeAsync(CreatePlateTypeRequest request)
    {
        var plate = new PlateType
        {
            NameAr = request.NameAr,
            NameEn = request.NameEn,
            SortOrder = request.SortOrder,
            IsActive = true
        };
        _context.PlateTypes.Add(plate);
        await _context.SaveChangesAsync();

        return new PlateTypeResponse
        {
            PlateTypeId = plate.PlateTypeId,
            NameAr = plate.NameAr,
            NameEn = plate.NameEn,
            IsActive = plate.IsActive,
            SortOrder = plate.SortOrder
        };
    }

    public async Task<SizeResponse> UpdateSizeAsync(int id, UpdateSizeRequest request)
    {
        var size = await _context.Sizes.FindAsync(id);
        if (size == null)
            throw new NotFoundException("Size", id);

        size.NameAr = request.NameAr;
        size.NameEn = request.NameEn;
        size.SortOrder = request.SortOrder;
        size.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        return new SizeResponse
        {
            SizeId = size.SizeId,
            NameAr = size.NameAr,
            NameEn = size.NameEn,
            IsActive = size.IsActive,
            SortOrder = size.SortOrder
        };
    }

    public async Task<PortionResponse> UpdatePortionAsync(int id, UpdatePortionRequest request)
    {
        var portion = await _context.Portions.FindAsync(id);
        if (portion == null)
            throw new NotFoundException("Portion", id);

        portion.NameAr = request.NameAr;
        portion.NameEn = request.NameEn;
        portion.SortOrder = request.SortOrder;
        portion.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        return new PortionResponse
        {
            PortionId = portion.PortionId,
            NameAr = portion.NameAr,
            NameEn = portion.NameEn,
            Multiplier = portion.Multiplier,
            IsActive = portion.IsActive,
            SortOrder = portion.SortOrder
        };
    }

    public async Task<PlateTypeResponse> UpdatePlateTypeAsync(int id, UpdatePlateTypeRequest request)
    {
        var plate = await _context.PlateTypes.FindAsync(id);
        if (plate == null)
            throw new NotFoundException("PlateType", id);

        plate.NameAr = request.NameAr;
        plate.NameEn = request.NameEn;
        plate.SortOrder = request.SortOrder;
        plate.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        return new PlateTypeResponse
        {
            PlateTypeId = plate.PlateTypeId,
            NameAr = plate.NameAr,
            NameEn = plate.NameEn,
            IsActive = plate.IsActive,
            SortOrder = plate.SortOrder
        };
    }

    private static ProductResponse MapToResponse(Product p) => new()
    {
        ProductId = p.ProductId,
        CategoryId = p.CategoryId,
        CategoryName = p.Category?.NameAr ?? "",
        NameAr = p.NameAr,
        NameEn = p.NameEn,
        Description = p.Description,
        PlateOption = p.PlateOption,
        IsActive = p.IsActive,
        SortOrder = p.SortOrder,
        Prices = p.Prices?.Select(MapPriceToResponse).ToList() ?? new(),
        PlateTypes = p.ProductPlates?.Select(pp => new PlateTypeResponse
        {
            PlateTypeId = pp.PlateType.PlateTypeId,
            NameAr = pp.PlateType.NameAr,
            NameEn = pp.PlateType.NameEn,
            IsActive = pp.PlateType.IsActive,
            SortOrder = pp.PlateType.SortOrder
        }).ToList() ?? new()
    };

    private static ProductPriceResponse MapPriceToResponse(ProductPrice pp) => new()
    {
        ProductPriceId = pp.ProductPriceId,
        SizeId = pp.SizeId,
        SizeName = pp.Size?.NameAr,
        PortionId = pp.PortionId,
        PortionName = pp.Portion?.NameAr,
        Price = pp.Price,
        IsActive = pp.IsActive
    };
}
