using System.Net;
using System.Text.Json;
using EidSystem.API.Exceptions;
using EidSystem.API.Models.DTOs.Responses;

namespace EidSystem.API.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var response = new ApiResponse<object>();

        switch (exception)
        {
            case NotFoundException notFoundEx:
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                response = ApiResponse<object>.ErrorResponse(notFoundEx.Message);
                break;

            case BusinessException businessEx:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response = ApiResponse<object>.ErrorResponse(businessEx.Message);
                break;

            case UnauthorizedException unauthorizedEx:
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                response = ApiResponse<object>.ErrorResponse(unauthorizedEx.Message);
                break;

            case ValidationException validationEx:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response = ApiResponse<object>.ErrorResponse(validationEx.Message, validationEx.Errors);
                break;

            default:
                _logger.LogError(exception, "An unhandled exception occurred");
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                response = ApiResponse<object>.ErrorResponse("An unexpected error occurred");
                break;
        }

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        await context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
    }
}
