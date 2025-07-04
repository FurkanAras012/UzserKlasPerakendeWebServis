using Uzser.CoreServices.Data;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;
using Uzser.CoreServices.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace Uzser.CoreServices.Services.Implementations
{
    public class UzserCustomerService : IUzserCustomerService
    {
        private readonly UzserDbContext _context;
        private readonly IMapper _mapper;

        public UzserCustomerService(UzserDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(UzserCustomerDto dto)
        {
            Console.WriteLine($"🟡 Kaydet çağrıldı - id:");

            var entity = _mapper.Map<UzserCustomer>(dto);
            entity.CreateDate = DateTime.Now;
            entity.WFState = 0;

            _context.UzserCustomers.Add(entity);
            await _context.SaveChangesAsync();

            return entity.Id;
        }

        public async Task<bool> UpdateAsync(int id, UzserCustomerDto dto)
        {
            Console.WriteLine($"🟡 Update çağrıldı - id: {id}");

            var entity = await _context.UzserCustomers.FirstOrDefaultAsync(x => x.Id == id);
            if (entity == null) return false;

            _mapper.Map(dto, entity);
            entity.UpdateDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<UzserCustomerDto?> GetByIdAsync(int id)
        {
            var entity = await _context.UzserCustomers.FirstOrDefaultAsync(x => x.FlowId == id);
            return entity == null ? null : _mapper.Map<UzserCustomerDto>(entity);
        }

        public async Task<UzserCustomerDto?> GetByCodeAsync(string customerCode)
        {
            var entity = await _context.UzserCustomers.FirstOrDefaultAsync(x => x.CustomerCode == customerCode);
            return entity == null ? null : _mapper.Map<UzserCustomerDto>(entity);
        }

        public async Task<UzserCustomerDto?> GetByFlowIdAsync(int flowId)
        {
            var entity = await _context.UzserCustomers.FirstOrDefaultAsync(x => x.FlowId == flowId);
            return entity == null ? null : _mapper.Map<UzserCustomerDto>(entity);
        }
    }
}
