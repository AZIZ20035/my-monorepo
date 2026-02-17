namespace EidSystem.API.Models.Entities;

public class Size
{
    public int SizeId { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;

    // Navigation
    public virtual ICollection<ProductPrice> ProductPrices { get; set; } = new List<ProductPrice>();
}
