// src/Backend/Services/PlanService.cs
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
            var priceIds = configuration.GetSection("Stripe:PriceIds").Get<Dictionary<string, string>>() ?? new Dictionary<string, string>();

            _plans = new List<PlanDetails>
            {
                new PlanDetails { InternalName = "Free", DisplayName = "Free", Price = 0, TextGenerationsLimit = 5, ThumbnailGenerationsLimit = 3, StripePriceId = "free_plan" },
                new PlanDetails { InternalName = "Paid1", DisplayName = "AIketing Essencial", Price = 29, TextGenerationsLimit = 50, ThumbnailGenerationsLimit = 20, StripePriceId = priceIds.GetValueOrDefault("AIketingEssencialMensal") },
                new PlanDetails { InternalName = "Paid2", DisplayName = "AIketing Pro", Price = 99, TextGenerationsLimit = 200, ThumbnailGenerationsLimit = 100, StripePriceId = priceIds.GetValueOrDefault("AIketingProMensal") }
            };
        }

        public IEnumerable<PlanDetails> GetAllPlans() => _plans.Where(p => p.InternalName != "Free");
        public PlanDetails GetDefaultPlan() => _plans.First(p => p.InternalName == "Free");
        public PlanDetails? GetPlanDetails(string? internalName) => _plans.FirstOrDefault(p => p.InternalName == internalName);
        public PlanDetails? GetPlanByStripePriceId(string priceId) => _plans.FirstOrDefault(p => p.StripePriceId == priceId);
    }
}