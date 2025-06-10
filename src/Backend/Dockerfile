# Fase 1: Build da Aplicação
# Usamos a imagem oficial do SDK do .NET 8
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copiar arquivos .csproj e restaurar dependências primeiro para aproveitar o cache do Docker
COPY src/Backend/*.csproj ./Backend/
RUN dotnet restore Backend/Backend.csproj

# Copiar o restante do código fonte do backend
COPY src/Backend/. ./Backend/

# Publicar a aplicação (compilar em modo Release e preparar para produção)
WORKDIR /app/Backend
RUN dotnet publish -c Release -o /app/publish

# Fase 2: Imagem Final de Runtime
# Usamos a imagem oficial do ASP.NET Runtime 8, que é menor que o SDK
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copiar a aplicação publicada da fase de build
COPY --from=build /app/publish .

# Expor a porta que a aplicação ASP.NET Core escuta (verifique Properties/launchSettings.json, geralmente 80 ou 8080 para HTTP dentro do container)
# Vamos usar a porta 8080 como padrão para Kestrel dentro do container
EXPOSE 8080

# Definir o ponto de entrada para executar a aplicação quando o container iniciar
ENTRYPOINT ["dotnet", "Backend.dll"]