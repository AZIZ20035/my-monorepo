namespace EidSystem.API.Models.Entities;

public class ProductPrice
{
    public int ProductPriceId { get; set; }
    public int ProductId { get; set; }
    public int? SizeId { get; set; }
    public int? PortionId { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public virtual Product Product { get; set; } = null!;
    public virtual Size? Size { get; set; }
    public virtual Portion? Portion { get; set; }
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
