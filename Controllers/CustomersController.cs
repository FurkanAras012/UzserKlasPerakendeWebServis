using Microsoft.AspNetCore.Mvc;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;
using Uzser.CoreServices.Services.Interfaces;
using Uzser.CoreServices.Utils;

namespace Uzser.CoreServices.Controllers
{
    [ApiController]
    [Route("api/v1/customers")]
    public class customersController : ControllerBase
    {
        private readonly IUzserCustomerService _customerService;
        private readonly ILogService _logService;

        public customersController(IUzserCustomerService customerService, ILogService logService)
        {
            _customerService = customerService;
            _logService = logService;
        }

        [HttpPost]
        public async Task<IActionResult> Save([FromBody] UzserCustomerDto dto)
        {
            if (dto.Id == 0)
            {
                var id = await _customerService.CreateAsync(dto);

                // ✅ Log: Ekleme
                await _logService.LogAsync("add", dto.CreateUser, dto);

                return Ok(ResponseWrapper<int>.SuccessResponse(id, "Cari başarıyla eklendi"));
            }
            else
            {
                var success = await _customerService.UpdateAsync(dto.Id, dto);

                // ✅ Log: Güncelleme
                await _logService.LogAsync("upd", dto.UpdateUser, dto);

                return Ok(ResponseWrapper<bool>.SuccessResponse(success, "Cari başarıyla güncellendi"));
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _customerService.GetByIdAsync(id);
            if (result == null)
                return Ok(ResponseWrapper<UzserCustomerDto>.SuccessResponse(null, "Yeni kayıt oluşturulacak"));

            return Ok(ResponseWrapper<UzserCustomerDto>.SuccessResponse(result));
        }
    }
}