namespace EidSystem.API.Models.Entities;

public class OrderItem
{
    public int OrderItemId { get; set; }
    public int OrderId { get; set; }
    public int ProductPriceId { get; set; }
    public int? PlateTypeId { get; set; }
    public int Quantity { get; set; } = 1;
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public string? Notes { get; set; }

    // Navigation
    public virtual Order Order { get; set; } = null!;
    public virtual ProductPrice ProductPrice { get; set; } = null!;
    public virtual PlateType? PlateType { get; set; }
}
