namespace EidSystem.API.Models.Entities;

public class Category
{
    public int CategoryId { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    public virtual ICollection<DayPeriodCategory> DayPeriodCategories { get; set; } = new List<DayPeriodCategory>();
}
