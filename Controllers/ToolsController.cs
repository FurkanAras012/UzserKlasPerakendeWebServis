using Microsoft.AspNetCore.Mvc;
using Uzser.CoreServices.Services.Interfaces;

namespace Uzser.CoreServices.Controllers
{
    [ApiController]
    [Route("api/v1/tools")]
    public class ToolsController : ControllerBase
    {
        private readonly IUtilityService _utilityService;

        public ToolsController(IUtilityService utilityService)
        {
            _utilityService = utilityService;
        }

        // 🎯 Base64 → Görsel → PNG byte[]
        [HttpPost("base64-to-image")]
        public IActionResult ConvertBase64ToImage([FromBody] string base64)
        {
            try
            {
                var imageBytes = _utilityService.Base64ToPngBytes(base64);
                return File(imageBytes, "image/png");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Görsel dönüşüm hatası", error = ex.Message });
            }
        }

        // 🎯 Base64 → Görsel → Base64 PNG
        [HttpPost("base64-to-image-base64")]
        public IActionResult ConvertBase64ToImageAsBase64([FromBody] string base64)
        {
            try
            {
                var imageBytes = _utilityService.Base64ToPngBytes(base64);
                var resultBase64 = Convert.ToBase64String(imageBytes);
                return Ok(new { base64 = resultBase64 });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Görsel dönüşüm hatası", error = ex.Message });
            }
        }

        // 🎯 HTML → PDF
        [HttpPost("html-to-pdf")]
        public IActionResult ConvertHtmlToPdf([FromBody] string html)
        {
            try
            {
                var pdfBytes = _utilityService.ConvertHtmlToPdf(html);
                return File(pdfBytes, "application/pdf", "output.pdf");
            }
            catch (NotImplementedException)
            {
                return StatusCode(501, new { message = "PDF dönüşümü henüz aktif değil" });
            }
        }
    }
}