// Models/GenerationHistory.cs
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Backend.Models;

namespace Backend.Models
{
    public class GenerationHistory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = default!;

        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        [Required]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [Required]
        [MaxLength(50)]
        // CORRIGIDO: Adicionado ; depois do get
        public string ContentType { get; set; } = string.Empty; // <-- Correção aqui

        [Required]
        [MaxLength(2000)]
        // CORRIGIDO: Adicionado ; depois do get
        public string InputPrompt { get; set; } = string.Empty; // <-- Correção aqui

        [Column(TypeName = "text")]
        // CORRIGIDO: Adicionado ; depois do get
        public string? OutputText { get; set; } // <-- Correção aqui

        [Column(TypeName = "text")]
        // CORRIGIDO: Adicionado ; depois do get
        public string? OutputImageBase64 { get; set; } // <-- Correção aqui (assumindo que era um dos erros)

        [MaxLength(100)]
        // CORRIGIDO: Adicionado ; depois do get
        public string? ModelUsed { get; set; } // <-- Correção aqui

        [MaxLength(10)]
        // CORRIGIDO: Adicionado ; depois do get
        public string? Language { get; set; } // <-- Correção aqui

        // public decimal? UsageCost { get; set; } // Custo da requisição (futuro)
    }
// REMOVIDO: Chave extra '}' que estava aqui
}