namespace EidSystem.API.Models.DTOs.Requests;

public class CreateCategoryRequest
{
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public string? Description { get; set; }
    public int SortOrder { get; set; } = 0;
}

public class UpdateCategoryRequest
{
    public string? NameAr { get; set; }
    public string? NameEn { get; set; }
    public string? Description { get; set; }
    public bool? IsActive { get; set; }
    public int? SortOrder { get; set; }
}

public class CreateProductRequest
{
    public int CategoryId { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public string? Description { get; set; }
    public string PlateOption { get; set; } = "none";
    public int SortOrder { get; set; } = 0;
    public List<CreateProductPriceRequest> Prices { get; set; } = new();
    public List<int> PlateTypeIds { get; set; } = new();
}

public class UpdateProductRequest
{
    public int? CategoryId { get; set; }
    public string? NameAr { get; set; }
    public string? NameEn { get; set; }
    public string? Description { get; set; }
    public string? PlateOption { get; set; }
    public bool? IsActive { get; set; }
    public int? SortOrder { get; set; }
}

public class CreateProductPriceRequest
{
    public int? SizeId { get; set; }
    public int? PortionId { get; set; }
    public decimal Price { get; set; }
}

public class UpdateProductPriceRequest
{
    public decimal? Price { get; set; }
    public bool? IsActive { get; set; }
}


