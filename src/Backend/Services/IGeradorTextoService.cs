// Services/IGeradorTextoService.cs
using System.Threading.Tasks;


namespace Backend.Services;

public interface IGeradorTextoService
{
    // Define o método que seu backend chamará para gerar texto
    // prompt: O texto de entrada/instrução para a IA
    // modelName: O nome do modelo a ser usado (Ex: "tinyllama")
    // Retorna o texto gerado pela IA (assincronamente)
    Task<string> GenerateTextAsync(string prompt, string modelName);

    // Para o futuro, podemos adicionar métodos que lidem com os idiomas,
    // múltiplas variações, ou retornem um objeto mais estruturado.
    // Ex: Task<List<string>> GenerateTextVariationsAsync(string prompt, string modelName, int numVariations, List<string> languages);
}