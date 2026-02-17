using System.Security.Claims;
using EidSystem.API.Models.DTOs.Requests;
using EidSystem.API.Models.DTOs.Responses;
using EidSystem.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EidSystem.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<OrderListResponse>>>> GetAll([FromQuery] OrderFilterRequest filter)
    {
        var result = await _orderService.GetAllAsync(filter);
        return Ok(ApiResponse<PaginatedResponse<OrderListResponse>>.SuccessResponse(result));
    }

    [HttpGet("today")]
    public async Task<ActionResult<ApiResponse<IEnumerable<OrderListResponse>>>> GetToday()
    {
        var result = await _orderService.GetTodayOrdersAsync();
        return Ok(ApiResponse<IEnumerable<OrderListResponse>>.SuccessResponse(result));
    }

    [HttpGet("by-period/{periodId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<OrderListResponse>>>> GetByPeriod(int periodId)
    {
        var result = await _orderService.GetByPeriodAsync(periodId);
        return Ok(ApiResponse<IEnumerable<OrderListResponse>>.SuccessResponse(result));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<OrderResponse>>> GetById(int id)
    {
        var result = await _orderService.GetByIdAsync(id);
        return Ok(ApiResponse<OrderResponse>.SuccessResponse(result));
    }



    [HttpPost]
    public async Task<ActionResult<ApiResponse<OrderResponse>>> Create([FromBody] CreateOrderRequest request)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var result = await _orderService.CreateAsync(request, userId);
        return Ok(ApiResponse<OrderResponse>.SuccessResponse(result, "تم إنشاء الطلب بنجاح"));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<OrderResponse>>> Update(int id, [FromBody] UpdateOrderRequest request)
    {
        var result = await _orderService.UpdateAsync(id, request);
        return Ok(ApiResponse<OrderResponse>.SuccessResponse(result, "تم تحديث الطلب بنجاح"));
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult<ApiResponse<object>>> UpdateStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        await _orderService.UpdateStatusAsync(id, request.Status, userId);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "تم تحديث حالة الطلب"));
    }

    [HttpPost("{id}/cancel")]
    public async Task<ActionResult<ApiResponse<object>>> Cancel(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        await _orderService.CancelAsync(id, userId);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "تم إلغاء الطلب"));
    }

    [HttpPost("{id}/payments")]
    public async Task<ActionResult<ApiResponse<PaymentResponse>>> AddPayment(int id, [FromBody] AddPaymentRequest request)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var result = await _orderService.AddPaymentAsync(id, request, userId);
        return Ok(ApiResponse<PaymentResponse>.SuccessResponse(result, "تم إضافة الدفعة بنجاح"));
    }
}
