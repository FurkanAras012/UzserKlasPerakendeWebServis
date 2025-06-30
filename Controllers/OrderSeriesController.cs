using Microsoft.AspNetCore.Mvc;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Services.Interfaces;
using Uzser.CoreServices.Utils;

namespace Uzser.CoreServices.Controllers
{
    [ApiController]
    [Route("api/v1/orderseries")]
    public class OrderSeriesController : ControllerBase
    {
        private readonly IOrderSeriesService _service;

        public OrderSeriesController(IOrderSeriesService service)
        {
            _service = service;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateOrderNumber([FromBody] GenerateOrderNumberRequest request)
        {
            try
            {
                var result = await _service.GenerateNextOrderNumberAsync(request.SeriesCode, request.UserId);
                return Ok(ResponseWrapper<GenerateOrderNumberResponse>.SuccessResponse(result, "Sipariş numarası oluşturuldu"));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseWrapper<string>.Fail($"Sipariş numarası oluşturulamadı: {ex.Message}", "GENERATION_ERROR"));
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSeries()
        {
            var result = await _service.GetAllSeriesAsync();
            return Ok(ResponseWrapper<List<OrderSeriesDto>>.SuccessResponse(result));
        }

        [HttpGet("{seriesCode}")]
        public async Task<IActionResult> GetSeriesByCode(string seriesCode)
        {
            var result = await _service.GetSeriesByCodeAsync(seriesCode);
            if (result == null)
                return NotFound(ResponseWrapper<string>.Fail("Seri bulunamadı", "NOT_FOUND"));

            return Ok(ResponseWrapper<OrderSeriesDto>.SuccessResponse(result));
        }

        [HttpPost]
        public async Task<IActionResult> CreateSeries([FromBody] OrderSeriesDto dto)
        {
            var id = await _service.CreateSeriesAsync(dto);
            return Ok(ResponseWrapper<int>.SuccessResponse(id, "Seri oluşturuldu"));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSeries(int id, [FromBody] OrderSeriesDto dto)
        {
            var result = await _service.UpdateSeriesAsync(id, dto);
            if (!result)
                return NotFound(ResponseWrapper<string>.Fail("Seri bulunamadı", "NOT_FOUND"));

            return Ok(ResponseWrapper<bool>.SuccessResponse(true, "Seri güncellendi"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSeries(int id)
        {
            var result = await _service.DeleteSeriesAsync(id);
            if (!result)
                return NotFound(ResponseWrapper<string>.Fail("Seri bulunamadı", "NOT_FOUND"));

            return Ok(ResponseWrapper<bool>.SuccessResponse(true, "Seri silindi"));
        }
    }
}
