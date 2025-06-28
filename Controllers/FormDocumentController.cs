using Microsoft.AspNetCore.Mvc;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Services.Interfaces;
using Uzser.CoreServices.Utils;
namespace Uzser.CoreServices.Controllers
{
    [ApiController]
    [Route("api/v1/form-documents")]
    public class FormDocumentController : ControllerBase
    {
        private readonly IFormDocumentService _formDocumentService;

        public FormDocumentController(IFormDocumentService formDocumentService)
        {
            _formDocumentService = formDocumentService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] UploadDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ResponseWrapper<string>.Fail("Eksik veya hatalı veri gönderildi.", "VALIDATION_ERROR"));

            var result = await _formDocumentService.UploadFileAsync(dto);
            if (result == null)
                return StatusCode(500, ResponseWrapper<string>.Fail("Dosya yüklenemedi.", "UPLOAD_FAILED"));

            result.PublicUrl = $"{Request.Scheme}://{Request.Host}/LogoServices/FormDocuments/{Uri.EscapeDataString(result.FileName)}";

            return Ok(ResponseWrapper<FormDocumentDto>.SuccessResponse(result));
        }

       [HttpGet("list")]
        public async Task<IActionResult> List([FromQuery] int flowId)
        {
           var result = await _formDocumentService.GetDocumentsAsync(flowId);
           return Ok(ResponseWrapper<List<FormDocumentDto>>.SuccessResponse(result, "Dosyalar başarıyla listelendi."));
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _formDocumentService.DeleteDocumentAsync(id);
            if (!success)
                return NotFound(ResponseWrapper<string>.Fail("Dosya bulunamadı veya silinemedi.", "NOT_FOUND"));

            return Ok(ResponseWrapper<string>.SuccessResponse("Dosya başarıyla silindi."));
        }
    }
}