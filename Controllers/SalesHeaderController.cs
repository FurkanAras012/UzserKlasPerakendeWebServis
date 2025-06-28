using Microsoft.AspNetCore.Mvc;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities; // Entity tipi için gerekli
using Uzser.CoreServices.Services.Interfaces;
using Uzser.CoreServices.Utils;

namespace Uzser.CoreServices.Controllers
{
    [ApiController]
    [Route("api/v1/sales")]
    public class SalesHeaderController : ControllerBase
    {
        private readonly ISalesHeaderService _service;
        private readonly ILogService _logService;

        public SalesHeaderController(ISalesHeaderService service, ILogService logService)
        {
            _service = service;
            _logService = logService;
        }

        [HttpPost]
        public async Task<IActionResult> Save([FromBody] SalesHeaderDto dto)
        {
            if (dto.Id == 0)
            {
                var id = await _service.CreateAsync(dto);

                // ✅ Log: Ekleme işlemi
                await _logService.LogAsync("add", dto.UserId,dto);

                return Ok(ResponseWrapper<int>.SuccessResponse(id, "Kayıt oluşturuldu"));
            }
            else
            {
                var success = await _service.UpdateAsync(dto.Id, dto);

                // ✅ Log: Güncelleme işlemi
                await _logService.LogAsync("upd", dto.UserId,dto);

                return Ok(ResponseWrapper<bool>.SuccessResponse(success, "Kayıt güncellendi"));
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
                return Ok(ResponseWrapper<SalesHeaderDto>.SuccessResponse(null, "Yeni kayıt oluşturulacak"));

            return Ok(ResponseWrapper<SalesHeaderDto>.SuccessResponse(result));
        }
    }
}
