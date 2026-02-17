namespace EidSystem.API.Models.Entities;

public class PlateType
{
    public int PlateTypeId { get; set; }
    public string NameAr { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;

    // Navigation
    public virtual ICollection<ProductPlate> ProductPlates { get; set; } = new List<ProductPlate>();
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
