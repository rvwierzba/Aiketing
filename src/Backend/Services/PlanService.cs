using Backend.Models.Plans;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Services
{
    public class PlanService : IPlanService
    {
        private readonly List<PlanDetails> _plans;

        public PlanService(IConfiguration configuration)
        {
            var priceIds = configuration.GetSection("Stripe:PriceIds").GetChildren().ToDictionary(x => x.Key, x => x.Value);

            _plans = new List<PlanDetails>
            {
                new PlanDetails 
                {
                    InternalName = "Free",
                    DisplayName = "Free",
                    Price = 0,
                    Currency = "BRL",
                    BillingPeriod = "mês",
                    TextGenerationsLimit = 5,
                    ThumbnailGenerationsLimit = 3,
                    Features = new List<string> { "Funcionalidades básicas", "Suporte da comunidade" },
                    StripePriceId = "free_plan" 
                },
                new PlanDetails 
                {
                    InternalName = "Paid1",
                    DisplayName = "AIketing Essencial",
                    Price = 29, 
                    Currency = "BRL",
                    BillingPeriod = "mês",
                    TextGenerationsLimit = 50,
                    ThumbnailGenerationsLimit = 20,
                    Features = new List<string> { "Todas as do Free", "Suporte prioritário" },
                    StripePriceId = priceIds.GetValueOrDefault("AIketingEssencialMensal") ?? ""
                },
                 new PlanDetails
                 {
                    InternalName = "Paid1Anual",
                    DisplayName = "AIketing Essencial Anual",
                    Price = 290, 
                    Currency = "BRL",
                    BillingPeriod = "ano",
                    TextGenerationsLimit = 600,
                    ThumbnailGenerationsLimit = 240,
                    Features = new List<string> { "Todas do Essencial", "Desconto de 2 meses" },
                    StripePriceId = priceIds.GetValueOrDefault("AIketingEssencialAnual") ?? ""
                 },
                new PlanDetails
                {
                    InternalName = "Paid2",
                    DisplayName = "AIketing Pro",
                    Price = 99, 
                    Currency = "BRL",
                    BillingPeriod = "mês",
                    TextGenerationsLimit = 200,
                    ThumbnailGenerationsLimit = 100,
                    Features = new List<string> { "Todas do Essencial", "Acesso antecipado" },
                    StripePriceId = priceIds.GetValueOrDefault("AIketingProMensal") ?? ""
                },
                new PlanDetails
                {
                    InternalName = "Paid2Anual",
                    DisplayName = "AIketing Pro Anual",
                    Price = 990, 
                    Currency = "BRL",
                    BillingPeriod = "ano",
                    TextGenerationsLimit = 2400,
                    ThumbnailGenerationsLimit = 1200,
                    Features = new List<string> { "Todas do Pro", "Desconto de 2 meses" },
                    StripePriceId = priceIds.GetValueOrDefault("AIketingProAnual") ?? ""
                }
            };
        }

        public IEnumerable<PlanDetails> GetAllPlans()
        {
            return _plans.Where(p => !string.IsNullOrEmpty(p.StripePriceId));
        }

        public PlanDetails GetDefaultPlan()
        {
            return _plans.First(p => p.InternalName == "Free");
        }

        public PlanDetails? GetPlanDetails(string internalName)
        {
            return _plans.FirstOrDefault(p => p.InternalName == internalName);
        }
    }
}