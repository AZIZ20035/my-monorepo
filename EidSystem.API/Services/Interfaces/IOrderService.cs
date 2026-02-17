using EidSystem.API.Models.DTOs.Requests;
using EidSystem.API.Models.DTOs.Responses;

namespace EidSystem.API.Services.Interfaces;

public interface IOrderService
{
    Task<PaginatedResponse<OrderListResponse>> GetAllAsync(OrderFilterRequest filter);
    Task<OrderResponse> GetByIdAsync(int id);

    Task<OrderResponse> CreateAsync(CreateOrderRequest request, int userId);
    Task<OrderResponse> UpdateAsync(int id, UpdateOrderRequest request);
    Task UpdateStatusAsync(int id, string status, int userId);
    Task CancelAsync(int id, int userId);
    Task<PaymentResponse> AddPaymentAsync(int orderId, AddPaymentRequest request, int userId);
    Task<IEnumerable<OrderListResponse>> GetTodayOrdersAsync();
    Task<IEnumerable<OrderListResponse>> GetByPeriodAsync(int eidDayPeriodId);
}
