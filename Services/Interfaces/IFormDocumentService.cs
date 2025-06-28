using Uzser.CoreServices.Models.DTO;

public interface IFormDocumentService
{
   
        Task<FormDocumentDto?> UploadFileAsync(UploadDto dto);
        Task<List<FormDocumentDto>> GetDocumentsAsync(int flowId);
        Task<bool> DeleteDocumentAsync(int id);
    
}
