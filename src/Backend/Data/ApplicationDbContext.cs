// Data/ApplicationDbContext.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore; // Necessário para IdentityDbContext
using Backend.Models; 

namespace Backend.Data;

// O DbContext agora herda de IdentityDbContext, usando sua classe User customizada
public class ApplicationDbContext : IdentityDbContext<User>
{
    public DbSet<GenerationHistory> GenerationHistory { get; set; }
    public DbSet<Project> Projects { get; set; }


    // O construtor precisa passar as opções para o construtor base
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Este método OnModelCreating é onde você customiza o schema do Identity ou outras tabelas
    // É ESSENCIAL chamar o método base para que o Identity configure suas tabelas
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Chamar o método base (IdentityDbContext) é ESSENCIAL para que as tabelas do Identity sejam configuradas!
        base.OnModelCreating(modelBuilder);

         modelBuilder.Entity<GenerationHistory>()
            .HasOne(gh => gh.User) // Cada Histórico tem Um Usuário
            .WithMany() // Um Usuário tem Muitos Históricos
            .HasForeignKey(gh => gh.UserId) // A chave estrangeira está em GenerationHistory (campo UserId)
            .IsRequired() // O relacionamento é obrigatório (um histórico sempre pertence a um usuário)
            .OnDelete(DeleteBehavior.Cascade); // Opcional: Se deletar um usuário, deleta seu histórico (comum, mas cuidado!)
                                             // DeleteBehavior.Restrict ou SetNull (se UserId pudesse ser null) são alternativas. Cascade é mais simples para MVP.
    }
}