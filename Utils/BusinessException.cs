namespace Uzser.CoreServices.Utils
{
    public class BusinessException : Exception
    {
        public string ErrorCode { get; }

        public BusinessException(string message, string errorCode = "BUSINESS")
            : base(message)
        {
            ErrorCode = errorCode;
        }
    }
}