namespace EidSystem.API.Models.Entities;

public class OrderPayment
{
    public int PaymentId { get; set; }
    public int OrderId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = "cash"; // cash, card, transfer
    public bool IsRefund { get; set; } = false;
    public string? Notes { get; set; }
    public int CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    // Navigation
    public virtual Order Order { get; set; } = null!;
    public virtual User CreatedByUser { get; set; } = null!;
}
