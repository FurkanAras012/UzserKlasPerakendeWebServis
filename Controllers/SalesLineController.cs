using Microsoft.AspNetCore.Mvc;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;
using Uzser.CoreServices.Services.Interfaces;
using Uzser.CoreServices.Utils;

namespace Uzser.CoreServices.Controllers
{
    [ApiController]
    [Route("api/v1/sales/line")]
    public class SalesLineController : ControllerBase
    {
        private readonly ISalesLineService _service;
        private readonly ILogService _logService;

        public SalesLineController(ISalesLineService service, ILogService logService)
        {
            _service = service;
            _logService = logService;
        }

        [HttpPost]
public async Task<IActionResult> SaveLine([FromBody] SalesLineDto dto)
{
    if (dto.Id == 0)
    {
        // 1) Önce yeni satırı oluştur ve ID’sini al
        var newId = await _service.CreateLineAsync(dto);

        // 2) Ardından bu ID ile tam DTO’yu yeniden çek
        var createdDto = await _service.GetLineByIdAsync(newId);

        // 3) Logla
        await _logService.LogAsync("add", dto.UserId, createdDto);

        // 4) Tam DTO’yu döndür
        return Ok(ResponseWrapper<SalesLineDto>.SuccessResponse(
            createdDto,
            "Yeni satır eklendi"
        ));
    }
    else
    {
        // Güncelleme tarafı zaten tam DTO’yu alabiliyorsa...
        var updated = await _service.UpdateLineAsync(dto.Id, dto);

        // Eğer UpdateLineAsync DTO dönüyorsa, onu kullanabiliriz. 
        // Aksi halde, benzer şekilde GetLineByIdAsync çağırın:
        var updatedDto = await _service.GetLineByIdAsync(dto.Id);

        await _logService.LogAsync("upd", dto.UserId, updatedDto);
        return Ok(ResponseWrapper<SalesLineDto>.SuccessResponse(
            updatedDto,
            "Satır güncellendi"
        ));
    }
}

        [HttpPost("delete-line")]
        public async Task<IActionResult> DeleteLine([FromBody] SalesLineDto dto)
        {
            if (dto == null || dto.Id == 0 || string.IsNullOrWhiteSpace(dto.UserId))
                return BadRequest(ResponseWrapper<string>.Fail("Geçersiz veri gönderildi", "INVALID_PAYLOAD"));

            var result = await _service.DeleteLineAsync(dto.Id);

            if (result)
            {
                await _logService.LogAsync("del", dto.UserId, dto);
                return Ok(ResponseWrapper<bool>.SuccessResponse(true, "Satır başarıyla silindi"));
            }

            return NotFound(ResponseWrapper<bool>.Fail("Satır bulunamadı", "NOT_FOUND"));
        }
         [HttpGet("listlines/{flowId}")]
        public async Task<IActionResult> GetLinesByMasterId(int flowId)
        {
         var result = await _service.GetLinesByMasterIdAsync(flowId);
         return Ok(ResponseWrapper<List<SalesLineDto>>.SuccessResponse(result));
        }

    }

    
}

