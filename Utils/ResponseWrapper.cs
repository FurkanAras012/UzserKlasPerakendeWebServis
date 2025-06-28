namespace Uzser.CoreServices.Utils
{
    public class ResponseWrapper<T>
{
    public bool success { get; set; }
    public string message { get; set; }
    public T data { get; set; }
    public string? errorCode { get; set; }       
    public string? errorDetail { get; set; }    

    public static ResponseWrapper<T> SuccessResponse(T data, string message = "")
    {
        return new ResponseWrapper<T>
        {
            success = true,
            message = message,
            data = data
        };
    }

   
    public static ResponseWrapper<T> Fail(string message, string? errorCode = null, string? errorDetail = null)
    {
        return new ResponseWrapper<T>
        {
            success = false,
            message = message,
            data = default!,
            errorCode = errorCode,
            errorDetail = errorDetail
        };
    }
}
}