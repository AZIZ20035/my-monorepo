namespace EidSystem.API.Services.Interfaces;

public interface IWhatsAppService
{
    Task SendOrderConfirmationAsync(int orderId);
    Task<string> GetOrderWhatsAppLinkAsync(int orderId);
    Task<bool> SendTestMessageAsync(string mobileNumber, string message);
}
