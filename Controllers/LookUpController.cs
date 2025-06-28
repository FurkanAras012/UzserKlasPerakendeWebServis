using Microsoft.AspNetCore.Mvc;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;
using Uzser.CoreServices.Services.Interfaces;
using Uzser.CoreServices.Utils;

namespace Uzser.CoreServices.Controllers
{
    [ApiController]
    [Route("api/v1/lookup")]
    public class LookupController : ControllerBase
    {
        private readonly ILookupService _lookupService;

        public LookupController(ILookupService lookupService)
        {
            _lookupService = lookupService;
        }

        [HttpGet("stocks")]
        public async Task<IActionResult> GetStocks()
        {
            var result = await _lookupService.GetStockListAsync();
            return Ok(ResponseWrapper<List<LookupItemDto>>.SuccessResponse(result));
        }

        [HttpGet("customers")]
        public async Task<IActionResult> GetCustomers()
        {
            var result = await _lookupService.GetCustomerListAsync();
            return Ok(ResponseWrapper<List<CustomerDto>>.SuccessResponse(result));
        }

        [HttpGet("departments")]
        public async Task<IActionResult> GetDepartments()
        {
            var result = await _lookupService.GetDepartmentListAsync();
            return Ok(ResponseWrapper<List<DepartmentsDto>>.SuccessResponse(result));
        }

        [HttpGet("vehicles")]
        public async Task<IActionResult> GetVehicles()
        {
            var result = await _lookupService.GetVehiclesListAsync();
            return Ok(ResponseWrapper<List<VehiclesDto>>.SuccessResponse(result));
        }
    }
}