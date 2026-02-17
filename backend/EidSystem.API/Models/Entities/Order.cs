namespace EidSystem.API.Models.Entities;

public class Order
{
    public int OrderId { get; set; }
    public int CustomerId { get; set; }
    public int? AddressId { get; set; }
    public int EidDayPeriodId { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public TimeSpan? DeliveryTime { get; set; }
    public decimal Subtotal { get; set; } = 0;
    public decimal DeliveryCost { get; set; } = 0;
    public decimal TotalCost { get; set; } = 0;
    public decimal PaidAmount { get; set; } = 0;
    public decimal RemainingAmount { get; set; } = 0;
    public string PaymentStatus { get; set; } = "unpaid"; // unpaid, partial, paid
    public string Status { get; set; } = "pending"; // pending, confirmed, preparing, ready, delivered, cancelled
    public string? Notes { get; set; }
    public int CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public virtual Customer Customer { get; set; } = null!;
    public virtual CustomerAddress? Address { get; set; }
    public virtual EidDayPeriod EidDayPeriod { get; set; } = null!;
    public virtual User CreatedByUser { get; set; } = null!;
    public virtual ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    public virtual ICollection<OrderPayment> Payments { get; set; } = new List<OrderPayment>();
    public virtual ICollection<WhatsappLog> WhatsappLogs { get; set; } = new List<WhatsappLog>();
}
