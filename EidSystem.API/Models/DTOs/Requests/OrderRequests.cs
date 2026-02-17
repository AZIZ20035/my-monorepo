namespace EidSystem.API.Models.DTOs.Requests;

public class CreateOrderRequest
{
    public int CustomerId { get; set; }
    public int? AddressId { get; set; }
    public int EidDayPeriodId { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public TimeSpan? DeliveryTime { get; set; }
    public decimal PaidAmount { get; set; } = 0;
    public string? Notes { get; set; }
    public List<OrderItemRequest> Items { get; set; } = new();
}

public class UpdateOrderRequest
{
    public int? AddressId { get; set; }
    public int? EidDayPeriodId { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public TimeSpan? DeliveryTime { get; set; }
    public string? Notes { get; set; }
}

public class OrderItemRequest
{
    public int ProductPriceId { get; set; }
    public int? PlateTypeId { get; set; }
    public int Quantity { get; set; } = 1;
    public string? Notes { get; set; }
}

public class UpdateOrderStatusRequest
{
    public string Status { get; set; } = string.Empty;
}

public class AddPaymentRequest
{
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = "cash";
    public bool IsRefund { get; set; } = false;
    public string? Notes { get; set; }
}

public class OrderFilterRequest
{
    public DateTime? Date { get; set; }
    public int? EidDayId { get; set; }
    public int? PeriodId { get; set; }
    public string? Status { get; set; }
    public string? PaymentStatus { get; set; }
    public int? CustomerId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
