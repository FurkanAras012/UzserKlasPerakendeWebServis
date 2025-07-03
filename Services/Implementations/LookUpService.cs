using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Uzser.CoreServices.Data;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Services.Interfaces;

namespace Uzser.CoreServices.Services.Implementations
{
    public class LookupService : ILookupService
    {
        private readonly ErpDbContext _erp;

        private readonly UzserDbContext _uzser;
        private readonly IMapper _mapper;

        public LookupService(ErpDbContext erp, UzserDbContext uzser, IMapper mapper)
        {
            _erp = erp;
            _mapper = mapper;
            _uzser = uzser;
        }

        public async Task<List<LookupItemDto>> GetStockListAsync()
        {
            return await _erp.Stocks
                .ProjectTo<LookupItemDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<List<CustomerDto>> GetCustomerListAsync()
        {
            return await _erp.Customers
                .ProjectTo<CustomerDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<List<DepartmentsDto>> GetDepartmentListAsync()
        {
            return await _erp.Departments
                .ProjectTo<DepartmentsDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

         public async Task<List<VehiclesDto>> GetVehiclesListAsync()
        {
            return await _uzser.Vehicles
                .ProjectTo<VehiclesDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<List<CitiesDto>> GetCitiesListAsync()
        {
           return await _erp.Cities
                .ProjectTo<CitiesDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }
    }
}
