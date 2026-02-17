using EidSystem.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EidSystem.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class WhatsAppTestController : ControllerBase
{
    private readonly IWhatsAppService _whatsAppService;

    public WhatsAppTestController(IWhatsAppService whatsAppService)
    {
        _whatsAppService = whatsAppService;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendTest(string phone, string message)
    {
        var result = await _whatsAppService.SendTestMessageAsync(phone, message);
        if (result)
            return Ok(new { Message = "Message sent successfully" });
        
        return BadRequest(new { Message = "Failed to send message, check logs" });
    }

    [HttpGet("get-link/{orderId}")]
    public async Task<IActionResult> GetLink(int orderId)
    {
        var link = await _whatsAppService.GetOrderWhatsAppLinkAsync(orderId);
        return Ok(new { Link = link });
    }

    [HttpPost("send-confirmation/{orderId}")]
    public async Task<IActionResult> SendConfirmation(int orderId)
    {
        await _whatsAppService.SendOrderConfirmationAsync(orderId);
        return Ok(new { Message = "Confirmation attempt completed" });
    }
}
