namespace EidSystem.API.Models.DTOs.Responses;

public class OrderResponse
{
    public int OrderId { get; set; }
    public CustomerSummary Customer { get; set; } = null!;
    public CustomerAddressResponse? Address { get; set; }
    public EidDayPeriodResponse Period { get; set; } = null!;
    public DateTime? DeliveryDate { get; set; }
    public TimeSpan? DeliveryTime { get; set; }
    public decimal Subtotal { get; set; }
    public decimal DeliveryCost { get; set; }
    public decimal TotalCost { get; set; }
    public decimal PaidAmount { get; set; }
    public decimal RemainingAmount { get; set; }
    public string PaymentStatus { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<OrderItemResponse> Items { get; set; } = new();
    public List<PaymentResponse> Payments { get; set; } = new();
    public string? WhatsAppLink { get; set; }
}

public class OrderItemResponse
{
    public int OrderItemId { get; set; }
    public int ProductPriceId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? SizeName { get; set; }
    public string? PortionName { get; set; }
    public int? PlateTypeId { get; set; }
    public string? PlateTypeName { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public string? Notes { get; set; }
}

public class PaymentResponse
{
    public int PaymentId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public bool IsRefund { get; set; }
    public string? Notes { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class OrderListResponse
{
    public int OrderId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string PeriodName { get; set; } = string.Empty;
    public DateTime? DeliveryDate { get; set; }
    public decimal TotalCost { get; set; }
    public decimal RemainingAmount { get; set; }
    public string PaymentStatus { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int ItemCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
