using EidSystem.API.Data;
using EidSystem.API.Models.Entities;
using EidSystem.API.Models.Settings;
using EidSystem.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace EidSystem.API.Services.Implementations;

public class WhatsAppService : IWhatsAppService
{
    private readonly TwilioSettings _settings;
    private readonly AppDbContext _context;
    private readonly ILogger<WhatsAppService> _logger;

    public WhatsAppService(
        IOptions<TwilioSettings> settings,
        AppDbContext context,
        ILogger<WhatsAppService> logger)
    {
        _settings = settings.Value;
        _context = context;
        _logger = logger;
    }

    public async Task SendOrderConfirmationAsync(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.Customer)
            .FirstOrDefaultAsync(o => o.OrderId == orderId);

        if (order == null || order.Customer == null)
        {
            _logger.LogError("Order {OrderId} or customer not found for WhatsApp notification", orderId);
            return;
        }

        var message = FormatOrderMessage(order.OrderId, order.Customer.Name);
        await SendWhatsAppMessageInternal(order.Customer.Phone, message, orderId, order.CustomerId);
    }

    public async Task<string> GetOrderWhatsAppLinkAsync(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.Customer)
            .FirstOrDefaultAsync(o => o.OrderId == orderId);

        if (order == null || order.Customer == null)
            return string.Empty;

        var message = FormatOrderMessage(order.OrderId, order.Customer.Name);
        var phone = FormatPhoneNumberForWhatsApp(order.Customer.Phone);
        
        return $"https://wa.me/{phone}?text={Uri.EscapeDataString(message)}";
    }

    private string FormatOrderMessage(int orderId, string customerName)
    {
        return $@"مرحباً {customerName}،
تم استلام طلبك رقم {orderId} بنجاح.
جاري العمل على تجهيز طلبك وسيتم إبلاغك عند التحديث.
شكراً لاختياركم أفران العيد.";
    }

    private string FormatPhoneNumberForWhatsApp(string phone)
    {
        phone = phone.Trim().Replace(" ", "").Replace("+", "");
        if (phone.StartsWith("05"))
        {
            return "966" + phone.Substring(1);
        }
        return phone;
    }

    public async Task<bool> SendTestMessageAsync(string mobileNumber, string message)
    {
        return await SendWhatsAppMessageInternal(mobileNumber, message, null, null);
    }

    private async Task<bool> SendWhatsAppMessageInternal(string phone, string content, int? orderId, int? customerId)
    {
        var log = new WhatsappLog
        {
            OrderId = orderId,
            CustomerId = customerId,
            PhoneNumber = phone,
            MessageContent = content,
            MessageType = "text",
            Status = "pending",
            CreatedAt = DateTime.UtcNow
        };

        try
        {
            _context.WhatsappLogs.Add(log);
            await _context.SaveChangesAsync();

            TwilioClient.Init(_settings.AccountSid, _settings.AuthToken);

            var to = new PhoneNumber($"whatsapp:{FormatPhoneNumber(phone)}");
            var from = new PhoneNumber(_settings.WhatsAppFrom);

            var message = await MessageResource.CreateAsync(
                body: content,
                from: from,
                to: to
            );

            log.Status = "sent";
            log.SentAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending WhatsApp message to {Phone}", phone);
            log.Status = "failed";
            log.ErrorMessage = ex.Message;
            await _context.SaveChangesAsync();
            return false;
        }
    }

    private string FormatPhoneNumber(string phone)
    {
        // Simple formatting, assuming user enters number starting with 05 or country code
        // For Saudi Arabia, if it starts with 05, replace with +9665
        phone = phone.Trim().Replace(" ", "");
        if (phone.StartsWith("05"))
        {
            return "+966" + phone.Substring(1);
        }
        if (!phone.StartsWith("+"))
        {
            // Default to +966 for this system as it's for Eid sacrifices in SA
            return "+966" + phone.TrimStart('0');
        }
        return phone;
    }
}
