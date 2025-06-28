using Microsoft.EntityFrameworkCore;
using Uzser.CoreServices.Data;
using Uzser.CoreServices.Models.DTO;
using Uzser.CoreServices.Services.Interfaces;
using System.Reflection;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
namespace Uzser.CoreServices.Services.Implementations
{
    public class LogService : ILogService
{
    private readonly UzserDbContext _context;

    public LogService(UzserDbContext context)
    {
        _context = context;
    }

        public async Task LogAsync<T>(string operation, string user, T dtoOrEntity)
{
    var type = dtoOrEntity.GetType(); // 🔥 DİNAMİK TİP

    var tableAttr = type.GetCustomAttribute<TableAttribute>();
    var tableName = tableAttr?.Name ?? type.Name;

    var keyProp = type
        .GetProperties()
        .FirstOrDefault(p => p.GetCustomAttribute<KeyAttribute>() != null);

    if (keyProp == null)
        throw new Exception($"[Key] attribute'lu alan {type.Name} içinde bulunamadı.");

    var keyArea = keyProp.Name;
    var keyValue = keyProp.GetValue(dtoOrEntity)?.ToString(); // Artık doğru tip eşleşiyor

    var log = new LogEntry
    {
        Operation = operation,
        OperationUser = user,
        OperationTime = DateTime.Now,
        TableName = tableName,
        KeyArea = keyArea,
        KeyValue = keyValue
    };

    _context.Add(log);
    await _context.SaveChangesAsync();
}

}

}