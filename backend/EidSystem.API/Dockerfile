# Use ASP.NET Core 8 runtime as base
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Use .NET SDK 8.0 for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY ["EidSystem.API.csproj", "./"]
RUN dotnet restore "EidSystem.API.csproj"

# Copy everything else and build
COPY . .
RUN dotnet build "EidSystem.API.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "EidSystem.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage - copy published app
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EidSystem.API.dll"]
