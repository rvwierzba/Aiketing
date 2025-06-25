// src/Backend/Services/IPlanService.cs
using Backend.Models.Plans;
using System.Collections.Generic;

namespace Backend.Services
{
    public interface IPlanService
    {
        PlanDetails? GetPlanDetails(string? planName);
        PlanDetails GetDefaultPlan();
        IEnumerable<PlanDetails> GetAllPlans();
        PlanDetails? GetPlanByStripePriceId(string priceId);
    }
}