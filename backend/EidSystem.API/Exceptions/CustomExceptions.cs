namespace EidSystem.API.Exceptions;

public class BusinessException : Exception
{
    public BusinessException(string message) : base(message)
    {
    }
}

public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message)
    {
    }

    public NotFoundException(string entityName, int id) 
        : base($"{entityName} with ID {id} not found")
    {
    }
}

public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message = "Unauthorized access") : base(message)
    {
    }
}

public class ValidationException : Exception
{
    public List<string> Errors { get; }

    public ValidationException(string message) : base(message)
    {
        Errors = new List<string> { message };
    }

    public ValidationException(List<string> errors) : base(string.Join(", ", errors))
    {
        Errors = errors;
    }
}
