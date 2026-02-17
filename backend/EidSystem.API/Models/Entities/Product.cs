namespace EidSystem.API.Models.Entities;

public class Product
{
    public int ProductId { get; set; }
    public int CategoryId { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public string? Description { get; set; }
    public string PlateOption { get; set; } = "none"; // none, fixed, choice
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public virtual Category Category { get; set; } = null!;
    public virtual ICollection<ProductPrice> Prices { get; set; } = new List<ProductPrice>();
    public virtual ICollection<ProductPlate> ProductPlates { get; set; } = new List<ProductPlate>();
}
