public interface ILogService
{
  Task LogAsync<T>(string operation, string user, T dtoOrEntity);
}