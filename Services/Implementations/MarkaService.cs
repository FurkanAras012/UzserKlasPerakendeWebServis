using Uzser.CoreServices.Data;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;
using Uzser.CoreServices.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace Uzser.CoreServices.Services.Implementations
{
    public class MarkaService : IMarkaService
    {
        private readonly UzserDbContext _context;
        private readonly IMapper _mapper;

        public MarkaService(UzserDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(MarkaDto dto)
        {
            Console.WriteLine($"🟡 Kaydet çağrıldı - id:");

            var entity = _mapper.Map<Marka>(dto);


            _context.Marka.Add(entity);
            await _context.SaveChangesAsync();

            return entity.Id;
        }



        public async Task<bool> UpdateAsync(int id, MarkaDto dto)
        {
            Console.WriteLine($"🟡 Update çağrıldı - id: {id}");

            var entity = await _context.Marka.FirstOrDefaultAsync(x => x.Id == id);
            if (entity == null) return false;

            _mapper.Map(dto, entity);


            await _context.SaveChangesAsync();
            return true;
        }

        // public async Task<MarkaDto?> GetByIdAsync(int id)
        // {
        //     var entity = await _context.Marka.FirstOrDefaultAsync(x => x.Id == id);
        //     return entity == null ? null : _mapper.Map<MarkaDto>(entity);
        // }

        public async Task<List<MarkaDto>> GetAllMarkas()
        {
            var entity = await _context.Marka.ToListAsync();
            if (entity == null || entity.Count == 0)
            {
                return new List<MarkaDto>();
            }
            else
            {
                return _mapper.Map<List<MarkaDto>>(entity);
            }
        }
    }
}
