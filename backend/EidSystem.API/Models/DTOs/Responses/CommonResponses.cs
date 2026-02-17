namespace EidSystem.API.Models.DTOs.Responses;

public class LoginResponse
{
    // Token is stored in HTTP-only cookie, not exposed to frontend
    internal string Token { get; set; } = string.Empty;
    public UserResponse User { get; set; } = null!;
    internal DateTime ExpiresAt { get; set; }
}

public class UserResponse
{
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CategoryResponse
{
    public int CategoryId { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
    public int ProductCount { get; set; }
}

public class ProductResponse
{
    public int ProductId { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public string? Description { get; set; }
    public string PlateOption { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
    public List<ProductPriceResponse> Prices { get; set; } = new();
    public List<PlateTypeResponse> PlateTypes { get; set; } = new();
}

public class ProductPriceResponse
{
    public int ProductPriceId { get; set; }
    public int? SizeId { get; set; }
    public string? SizeName { get; set; }
    public int? PortionId { get; set; }
    public string? PortionName { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; }
}

public class SizeResponse
{
    public int SizeId { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
}

public class PortionResponse
{
    public int PortionId { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public decimal Multiplier { get; set; }
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
}

public class PlateTypeResponse
{
    public int PlateTypeId { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
}

public class AreaResponse
{
    public int AreaId { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public decimal DeliveryCost { get; set; }
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
}
