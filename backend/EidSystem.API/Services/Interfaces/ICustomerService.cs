using EidSystem.API.Models.DTOs.Requests;
using EidSystem.API.Models.DTOs.Responses;

namespace EidSystem.API.Services.Interfaces;

public interface ICustomerService
{
    Task<IEnumerable<CustomerResponse>> GetAllAsync();
    Task<CustomerResponse?> GetByPhoneAsync(string phone);
    Task<CustomerResponse> GetByIdAsync(int id);
    Task<CustomerResponse> CreateAsync(CreateCustomerRequest request);
    Task<CustomerResponse> UpdateAsync(int id, UpdateCustomerRequest request);
    Task<CustomerAddressResponse> AddAddressAsync(int customerId, CreateCustomerAddressRequest request);
    Task<CustomerAddressResponse> UpdateAddressAsync(int addressId, UpdateCustomerAddressRequest request);
    Task<IEnumerable<OrderListResponse>> GetOrdersAsync(int customerId);
}
