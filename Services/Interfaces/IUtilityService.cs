using System.Drawing;

namespace Uzser.CoreServices.Services.Interfaces
{
    public interface IUtilityService
    {
        // Görsel işlemleri
        Image Base64ToImage(string base64);
        byte[] Base64ToPngBytes(string base64);
        string SaveBase64ToFile(string base64, string folderPath);

        // Dönüştürme
        byte[] Base64ToBytes(string base64);
        string BytesToBase64(byte[] bytes);

        // PDF (şimdilik NotImplemented)
        byte[] ConvertHtmlToPdf(string html);
    }
}