using Uzser.CoreServices.Data;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Models.Entities;
using Uzser.CoreServices.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace Uzser.CoreServices.Services.Implementations
{
    public class FormDocumentService : IFormDocumentService
    {
        private readonly UzserDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _httpContext;

        public FormDocumentService(UzserDbContext context, IWebHostEnvironment env,IHttpContextAccessor httpContext)
        {
            _context = context;
            _env = env;
            _httpContext = httpContext;
        }

        public async Task<FormDocumentDto?> UploadFileAsync(UploadDto dto)
        {
            var ext = Path.GetExtension(dto.File.FileName).ToLowerInvariant();
            var allowedExtensions = new[] { ".pdf", ".png", ".jpg", ".jpeg" };

            if (!allowedExtensions.Contains(ext) || string.IsNullOrEmpty(_env.WebRootPath))
                return null;

            var folder = Path.Combine(_env.WebRootPath, "LogoServices", "FormDocuments");
            Directory.CreateDirectory(folder);

            var newFileName = $"{dto.File.FileName}_{dto.FlowId}_{Guid.NewGuid()}{ext}";
            var fullPath = Path.Combine(folder, newFileName);
            var savedFileName = $"{dto.FlowId}_{Guid.NewGuid()}{ext}";

            try
            {
                using var stream = new FileStream(fullPath, FileMode.Create);
                await dto.File.CopyToAsync(stream);
            }
            catch
            {
                return null;
            }

            var entity = new FormDocument
            {
                FlowId = dto.FlowId ?? 0,
                FormName = dto.FormName,
                CreateUser = "system", // frontend göndermiyorsa burada sabit değer olabilir
                CreateDate = DateTime.Now,
                FileName = dto.File.FileName,
                FilePath = fullPath,
                FileType = dto.File.ContentType,
                FileSize = dto.File.Length,
                Description = string.Empty,
                OriginalFileName = dto.File.FileName,
                SavedFileName = savedFileName
            };

            _context.FormDocuments.Add(entity);
            await _context.SaveChangesAsync();

            return new FormDocumentDto
            {
                Id = entity.Id,
                FlowId = entity.FlowId,
                FileName = entity.FileName,
                FilePath = $"/LogoServices/FormDocuments/{newFileName}",
                FileType = entity.FileType,
                FileSize = entity.FileSize,
                FormName = entity.FormName,
                CreateUser = entity.CreateUser,
                CreateDate = entity.CreateDate,
                Description = entity.Description
            };
        }

        public async Task<List<FormDocumentDto>> GetDocumentsAsync(int flowId)
{
    var baseUrl = $"{_httpContext.HttpContext.Request.Scheme}://{_httpContext.HttpContext.Request.Host}";

    return await _context.FormDocuments
        .Where(x => x.FlowId == flowId)
        .Select(x => new FormDocumentDto
        {
            Id = x.Id,
            FlowId = x.FlowId,
            FileName = x.FileName,
            FilePath = x.FilePath.Replace(_env.WebRootPath, ""), // İsteğe bağlı
            FileType = x.FileType,
            FileSize = x.FileSize,
            FormName = x.FormName,
            CreateUser = x.CreateUser,
            CreateDate = x.CreateDate,
            Description = x.Description,
            PublicUrl = $"{baseUrl}/LogoServices/FormDocuments/{Uri.EscapeDataString(Path.GetFileName(x.FilePath))}"
        })
        .ToListAsync();
}

        public async Task<bool> DeleteDocumentAsync(int id)
        {
            var entity = await _context.FormDocuments.FindAsync(id);
            if (entity == null)
                return false;

            if (File.Exists(entity.FilePath))
            {
                try { File.Delete(entity.FilePath); }
                catch { /* loglanabilir */ }
            }

            _context.FormDocuments.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

