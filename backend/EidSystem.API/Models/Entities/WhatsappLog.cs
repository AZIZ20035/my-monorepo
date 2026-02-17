namespace EidSystem.API.Models.Entities;

public class WhatsappLog
{
    public int LogId { get; set; }
    public int? OrderId { get; set; }
    public int? CustomerId { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string MessageType { get; set; } = "text"; // text, template
    public string MessageContent { get; set; } = string.Empty;
    public string Status { get; set; } = "pending"; // pending, sent, delivered, failed
    public string? ErrorMessage { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? SentAt { get; set; }

    // Navigation Properties
    public Order? Order { get; set; }
    public Customer? Customer { get; set; }
}

