using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

public class UploadDto
{
    [Required]
    [FromForm]
    public IFormFile File { get; set; }
    public int? FormId { get; set; } // varsa
    public int? FlowId { get; set; } // varsa
   public string FormName { get; set; } // varsa
}