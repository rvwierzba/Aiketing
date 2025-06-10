// Models/User.cs
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models
{
    public class User : IdentityUser
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(50)]
        public string? CurrentPlanName { get; set; }

        public DateTime SubscriptionCycleStart { get; set; }

        // --- NOVOS CAMPOS PARA IDs DO STRIPE ---
        /// <summary>
        /// ID do Cliente no Stripe (cus_xxxx). Associado a este usuário.
        /// </summary>
        [MaxLength(100)] // IDs do Stripe podem ser longos
        public string? StripeCustomerId { get; set; }

        /// <summary>
        /// ID da Assinatura ativa no Stripe (sub_xxxx). Associada a este usuário.
        /// Pode ser nulo se o usuário estiver no plano Free ou cancelado.
        /// </summary>
        [MaxLength(100)]
        public string? StripeSubscriptionId { get; set; }
        // --- FIM DOS NOVOS CAMPOS ---
    }
}