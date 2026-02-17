using EidSystem.API.Models.DTOs.Requests;
using EidSystem.API.Models.DTOs.Responses;
using EidSystem.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EidSystem.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _customerService;

    public CustomersController(ICustomerService customerService)
    {
        _customerService = customerService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<CustomerResponse>>>> GetAll()
    {
        var result = await _customerService.GetAllAsync();
        return Ok(ApiResponse<IEnumerable<CustomerResponse>>.SuccessResponse(result));
    }

    [HttpGet("search")]
    public async Task<ActionResult<ApiResponse<CustomerResponse>>> SearchByPhone([FromQuery] string phone)
    {
        var result = await _customerService.GetByPhoneAsync(phone);
        if (result == null)
            return Ok(ApiResponse<CustomerResponse>.SuccessResponse(null!, "لا يوجد عميل بهذا الرقم"));
        return Ok(ApiResponse<CustomerResponse>.SuccessResponse(result));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<CustomerResponse>>> GetById(int id)
    {
        var result = await _customerService.GetByIdAsync(id);
        return Ok(ApiResponse<CustomerResponse>.SuccessResponse(result));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<CustomerResponse>>> Create([FromBody] CreateCustomerRequest request)
    {
        var result = await _customerService.CreateAsync(request);
        return Ok(ApiResponse<CustomerResponse>.SuccessResponse(result, "تم إنشاء العميل بنجاح"));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<CustomerResponse>>> Update(int id, [FromBody] UpdateCustomerRequest request)
    {
        var result = await _customerService.UpdateAsync(id, request);
        return Ok(ApiResponse<CustomerResponse>.SuccessResponse(result, "تم تحديث العميل بنجاح"));
    }

    [HttpPost("{id}/addresses")]
    public async Task<ActionResult<ApiResponse<CustomerAddressResponse>>> AddAddress(int id, [FromBody] CreateCustomerAddressRequest request)
    {
        var result = await _customerService.AddAddressAsync(id, request);
        return Ok(ApiResponse<CustomerAddressResponse>.SuccessResponse(result, "تم إضافة العنوان بنجاح"));
    }

    [HttpGet("{id}/orders")]
    public async Task<ActionResult<ApiResponse<IEnumerable<OrderListResponse>>>> GetOrders(int id)
    {
        var result = await _customerService.GetOrdersAsync(id);
        return Ok(ApiResponse<IEnumerable<OrderListResponse>>.SuccessResponse(result));
    }
}
