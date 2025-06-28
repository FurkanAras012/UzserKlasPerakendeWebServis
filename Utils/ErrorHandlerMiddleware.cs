using System.Net;
using System.Text.Json;
using Uzser.CoreServices.Utils;

namespace Uzser.CoreServices.Utils
{
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlerMiddleware> _logger;

        public ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context); // normal akış
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Global hata yakalandı");

                await HandleExceptionAsync(context, ex);
            }
        }

       private Task HandleExceptionAsync(HttpContext context, Exception exception)
{
    var response = context.Response;
    response.ContentType = "application/json";

    string errorCode = "EXCEPTION";
    int statusCode = (int)HttpStatusCode.InternalServerError;
    string message = "Sunucu hatası oluştu.";

    if (exception is BusinessException businessEx)
    {
        errorCode = businessEx.ErrorCode;
        message = businessEx.Message;
        statusCode = (int)HttpStatusCode.BadRequest; // 400 döner
    }
    else if (exception is UnauthorizedAccessException)
    {
        errorCode = "UNAUTHORIZED";
        statusCode = (int)HttpStatusCode.Forbidden;
        message = "Yetkiniz yok.";
    }
    else if (exception is ArgumentNullException)
    {
        errorCode = "NULL_ARGUMENT";
        statusCode = (int)HttpStatusCode.BadRequest;
        message = "Eksik veri gönderildi.";
    }

    response.StatusCode = statusCode;

    var errorResponse = ResponseWrapper<string>.Fail(
        message: message,
        errorCode: errorCode,
        errorDetail: exception.Message // veya exception.ToString() (detaylı log için)
    );

    var result = JsonSerializer.Serialize(errorResponse);
    return response.WriteAsync(result);
}

    }
}