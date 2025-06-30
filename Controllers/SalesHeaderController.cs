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
            try
            {
                if (dto.Id == 0)
                {
                    Console.WriteLine($"Creating new record for customer: {dto.CustomerCode}");
                    
                    var id = await _service.CreateAsync(dto);
                    Console.WriteLine($"Created record with ID: {id}");
                    
                    var result = await _service.GetByIdAsync(id);
                    Console.WriteLine($"Retrieved record: {result?.Id}");
                    
                    if (result == null)
                    {
                        Console.WriteLine("ERROR: Could not retrieve created record");
                        return BadRequest(ResponseWrapper<SalesHeaderDto>.Fail("Kayıt oluşturulamadı"));
                    }

                    // ✅ Log: Ekleme işlemi
                    await _logService.LogAsync("add", dto.UserId ?? "unknown", dto);

                    Console.WriteLine("Returning success response");
                    return Ok(ResponseWrapper<SalesHeaderDto>.SuccessResponse(result, "Kayıt oluşturuldu"));
                }
                else
                {
                    Console.WriteLine($"Updating record with ID: {dto.Id}");
                    
                    var success = await _service.UpdateAsync(dto.Id, dto);
                    Console.WriteLine($"Update result: {success}");
                    
                    var result = await _service.GetByIdAsync(dto.Id);
                    Console.WriteLine($"Retrieved updated record: {result?.Id}");
                    
                    if (result == null)
                    {
                        Console.WriteLine("ERROR: Could not retrieve updated record");
                        return BadRequest(ResponseWrapper<SalesHeaderDto>.Fail("Kayıt güncellenemedi"));
                    }

                    // ✅ Log: Güncelleme işlemi
                    await _logService.LogAsync("upd", dto.UserId ?? "unknown", dto);

                    Console.WriteLine("Returning update success response");
                    return Ok(ResponseWrapper<SalesHeaderDto>.SuccessResponse(result, "Kayıt güncellendi"));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR in Save method: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return BadRequest(ResponseWrapper<SalesHeaderDto>.Fail($"Hata oluştu: {ex.Message}"));
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
                return Ok(ResponseWrapper<SalesHeaderDto>.Fail("Yeni kayıt oluşturulacak"));

            return Ok(ResponseWrapper<SalesHeaderDto>.SuccessResponse(result));
        }

        [HttpGet("flow/{flowId}")]
        public async Task<IActionResult> GetByFlowId(int flowId)
        {
            var result = await _service.GetByFlowIdAsync(flowId);
            if (result == null)
                return Ok(ResponseWrapper<SalesHeaderDto>.Fail("Kayıt bulunamadı"));

            return Ok(ResponseWrapper<SalesHeaderDto>.SuccessResponse(result));
        }
    }
}
