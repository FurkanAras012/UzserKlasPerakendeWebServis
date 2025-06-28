using Uzser.CoreServices.Data;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;
using Uzser.CoreServices.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace Uzser.CoreServices.Services.Implementations
{
    public class ModelService : IModelService
    {
        private readonly UzserDbContext _context;
        private readonly IMapper _mapper;

        public ModelService(UzserDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<int> CreateAsync(ModelDto dto)
        {
            Console.WriteLine($"🟡 Kaydet çağrıldı - id:");

            var entity = _mapper.Map<Model>(dto);
            

            _context.Marka.Add(entity);
            await _context.SaveChangesAsync();

            return entity.Id;
        }

        public async Task<bool> UpdateAsync(int id, ModelDto dto)
        {
            Console.WriteLine($"🟡 Update çağrıldı - id: {id}");

            var entity = await _context.Model.FirstOrDefaultAsync(x => x.Id == id);
            if (entity == null) return false;

            _mapper.Map(dto, entity);
            

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ModelDto?> GetByIdAsync(int id)
        {
            var entity = await _context.Model.FirstOrDefaultAsync(x => x.Id == id);
            return entity == null ? null : _mapper.Map<ModelDto>(entity);
        }
    }
}
