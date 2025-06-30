using Microsoft.AspNetCore.Mvc;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;
using Uzser.CoreServices.Services.Interfaces;
using Uzser.CoreServices.Utils;

namespace Uzser.CoreServices.Controllers
{
    [ApiController]
    [Route("api/v1/usermapping")]
    public class UserMappingController : ControllerBase
    {
        private readonly IUserMappingService _service;

        public UserMappingController(IUserMappingService service)
        {
            _service = service;
        }

        [HttpGet("flowusers")]
        public async Task<IActionResult> GetFlowUsers()
        {
            try
            {
                var result = await _service.GetFlowUsersAsync();
                return Ok(ResponseWrapper<List<FlowUser>>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseWrapper<List<FlowUser>>.Fail($"Flow kullanıcıları getirilemedi: {ex.Message}"));
            }
        }

        [HttpGet("tigerusers")]
        public async Task<IActionResult> GetTigerUsers()
        {
            try
            {
                var result = await _service.GetTigerUsersAsync();
                return Ok(ResponseWrapper<List<TigerUser>>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseWrapper<List<TigerUser>>.Fail($"Tiger kullanıcıları getirilemedi: {ex.Message}"));
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetUserMappings()
        {
            try
            {
                var result = await _service.GetUserMappingsAsync();
                return Ok(ResponseWrapper<List<UserMappingDto>>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseWrapper<List<UserMappingDto>>.Fail($"Kullanıcı eşleştirmeleri getirilemedi: {ex.Message}"));
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserMappingById(int id)
        {
            try
            {
                var result = await _service.GetUserMappingByIdAsync(id);
                if (result == null)
                    return NotFound(ResponseWrapper<UserMappingDto>.Fail("Eşleştirme bulunamadı"));

                return Ok(ResponseWrapper<UserMappingDto>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseWrapper<UserMappingDto>.Fail($"Eşleştirme getirilemedi: {ex.Message}"));
            }
        }

        [HttpGet("byflowuser/{flowUserId}")]
        public async Task<IActionResult> GetUserMappingByFlowUserId(string flowUserId)
        {
            try
            {
                var result = await _service.GetUserMappingByFlowUserIdAsync(flowUserId);
                if (result == null)
                    return NotFound(ResponseWrapper<UserMappingDto>.Fail("Eşleştirme bulunamadı"));

                return Ok(ResponseWrapper<UserMappingDto>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseWrapper<UserMappingDto>.Fail($"Eşleştirme getirilemedi: {ex.Message}"));
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateUserMapping([FromBody] CreateUserMappingRequest request)
        {
            try
            {
                var id = await _service.CreateUserMappingAsync(request);
                var result = await _service.GetUserMappingByIdAsync(id);
                
                return Ok(ResponseWrapper<UserMappingDto?>.SuccessResponse(result, "Kullanıcı eşleştirmesi oluşturuldu"));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseWrapper<UserMappingDto?>.Fail($"Eşleştirme oluşturulamadı: {ex.Message}"));
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserMapping(int id, [FromBody] CreateUserMappingRequest request)
        {
            try
            {
                var success = await _service.UpdateUserMappingAsync(id, request);
                if (!success)
                    return NotFound(ResponseWrapper<UserMappingDto?>.Fail("Eşleştirme bulunamadı"));

                var result = await _service.GetUserMappingByIdAsync(id);
                return Ok(ResponseWrapper<UserMappingDto?>.SuccessResponse(result, "Kullanıcı eşleştirmesi güncellendi"));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseWrapper<UserMappingDto?>.Fail($"Eşleştirme güncellenemedi: {ex.Message}"));
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserMapping(int id, [FromQuery] string userId)
        {
            try
            {
                var success = await _service.DeleteUserMappingAsync(id, userId);
                if (!success)
                    return NotFound(ResponseWrapper<object?>.Fail("Eşleştirme bulunamadı"));

                return Ok(ResponseWrapper<object?>.SuccessResponse(null, "Kullanıcı eşleştirmesi silindi"));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseWrapper<object?>.Fail($"Eşleştirme silinemedi: {ex.Message}"));
            }
        }
    }
}
