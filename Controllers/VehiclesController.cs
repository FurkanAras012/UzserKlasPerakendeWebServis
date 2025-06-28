using Microsoft.AspNetCore.Mvc;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Services.Interfaces;
using Uzser.CoreServices.Utils;

namespace Uzser.CoreServices.Controllers
{
    [ApiController]
    [Route("api/v1/vehicles")]
    public class VehiclesController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;
        private readonly ILogService _logService;

        public VehiclesController(IVehicleService vehicleService, ILogService logService)
        {
            _vehicleService = vehicleService;
            _logService = logService;
        }

        [HttpPost]
        public async Task<IActionResult> Save([FromBody] VehiclesDto dto)
        {
            if (dto.Id == 0)
            {
                var id = await _vehicleService.CreateAsync(dto);

                // ✅ Log: Ekleme
                await _logService.LogAsync("add", dto.CreateUser, dto);

                return Ok(ResponseWrapper<int>.SuccessResponse(id, "Araç başarıyla eklendi"));
            }
            else
            {
                var success = await _vehicleService.UpdateAsync(dto.Id, dto);

                // ✅ Log: Güncelleme
                await _logService.LogAsync("upd", dto.UpdateUser, dto);

                return Ok(ResponseWrapper<bool>.SuccessResponse(success, "Araç başarıyla güncellendi"));
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _vehicleService.GetByIdAsync(id);
            if (result == null)
                return Ok(ResponseWrapper<VehiclesDto>.SuccessResponse(null, "Yeni kayıt oluşturulacak"));

            return Ok(ResponseWrapper<VehiclesDto>.SuccessResponse(result));
        }
    }
}