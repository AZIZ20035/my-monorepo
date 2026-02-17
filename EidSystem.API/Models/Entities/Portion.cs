namespace EidSystem.API.Models.Entities;

public class Portion
{
    public int PortionId { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public decimal Multiplier { get; set; } = 1.00m;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;

    // Navigation
    public virtual ICollection<ProductPrice> ProductPrices { get; set; } = new List<ProductPrice>();
}
