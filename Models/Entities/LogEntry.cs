using System.ComponentModel.DataAnnotations.Schema;

[Table("UZS_TBL_LOGS")]
public class LogEntry
{
    public int Id { get; set; }
    public string Operation { get; set; } = string.Empty;
    public string OperationUser { get; set; } = string.Empty;
    public DateTime OperationTime { get; set; } = DateTime.UtcNow;
    public string TableName { get; set; } = string.Empty;
    public string? KeyArea { get; set; }   // Örn: "Id" veya "TalepNo"
    public string? KeyValue { get; set; } 
}