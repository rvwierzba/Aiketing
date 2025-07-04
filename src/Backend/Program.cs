// src/Backend/Program.cs

using Backend.Data;
using Backend.Models;
using Backend.Models.Requests;
using Backend.Models.Responses;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Stripe;
using Stripe.Checkout;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

// CORREÇÃO (CS0104): Resolve a ambiguidade de 'PlanService' criando um "apelido".
using AppPlanService = Backend.Services.PlanService;

var builder = WebApplication.CreateBuilder(args);

StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"] ?? throw new InvalidOperationException("Chave Stripe não configurada.");

// --- Configuração dos Serviços ---
builder.Services.AddHttpContextAccessor();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Version = "v1", Title = "AIketing API" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme { In = ParameterLocation.Header, Name = "Authorization", Type = SecuritySchemeType.Http, Scheme = "Bearer", BearerFormat = "JWT" });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement { { new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }, new List<string>() } });
});

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddIdentity<User, IdentityRole>(options => {
    options.SignIn.RequireConfirmedAccount = false;
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
}).AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options => {
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true, IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        ValidateIssuer = true, ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true, ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateLifetime = true, ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddHttpClient();
builder.Services.AddScoped<IGeradorTextoService, GeradorTextoServiceLocalOllama>();
builder.Services.AddScoped<IGeradorImagemService, GeradorImagemServiceApiExterna>();
builder.Services.AddScoped<IPlanService, AppPlanService>();

if (builder.Environment.IsDevelopment()) { builder.Services.AddCors(options => options.AddPolicy("AllowAll", policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader())); }

var app = builder.Build();

if (app.Environment.IsDevelopment()) { app.UseSwagger(); app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "AIketing API v1")); app.UseCors("AllowAll"); }

// app.UseHttpsRedirection(); // Comentado para desenvolvimento local
app.UseAuthentication();
app.UseAuthorization();

// --- ENDPOINTS COMPLETOS DA APLICAÇÃO ---

app.MapPost("/api/auth/register", async ([FromBody] RegisterRequest request, UserManager<User> userManager) =>
{
    var userExists = await userManager.FindByEmailAsync(request.Email);
    if (userExists != null) return Results.Conflict(new { message = "Usuário com este e-mail já existe." });
    var user = new User { UserName = request.Email, Email = request.Email, CreatedAt = DateTime.UtcNow, CurrentPlanName = "Free", SubscriptionCycleStart = DateTime.UtcNow };
    var result = await userManager.CreateAsync(user, request.Password);
    return result.Succeeded ? Results.Ok(new { message = "Usuário registrado com sucesso!" }) : Results.BadRequest(new { errors = result.Errors.Select(e => e.Description) });
}).WithName("Register").WithTags("Auth");

app.MapPost("/api/auth/login", async ([FromBody] LoginRequest request, UserManager<User> userManager, IConfiguration config) =>
{
    var user = await userManager.FindByEmailAsync(request.Email);
    if (user == null || !await userManager.CheckPasswordAsync(user, request.Password)) return Results.Unauthorized();
    
    var authClaims = new List<Claim> { new(ClaimTypes.NameIdentifier, user.Id), new(ClaimTypes.Email, user.Email!) };
    var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
    var token = new JwtSecurityToken(issuer: config["Jwt:Issuer"], audience: config["Jwt:Audience"], expires: DateTime.Now.AddHours(24), claims: authClaims, signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256));
    
    return Results.Ok(new LoginResponse { Token = new JwtSecurityTokenHandler().WriteToken(token), Expiration = token.ValidTo, UserId = user.Id, Email = user.Email! });
}).WithName("Login").WithTags("Auth");

app.MapGet("/api/dashboard/summary", async (ClaimsPrincipal claims, UserManager<User> userManager, IPlanService planService) =>
{
    var userId = claims.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId == null) return Results.Unauthorized();
    var user = await userManager.FindByIdAsync(userId);
    if (user == null) return Results.NotFound();
    var plan = planService.GetPlanDetails(user.CurrentPlanName) ?? planService.GetDefaultPlan();
    return Results.Ok(new { plan.DisplayName, plan.TextGenerationsLimit, plan.ThumbnailGenerationsLimit });
}).WithName("GetDashboardSummary").RequireAuthorization().WithTags("Dashboard");

app.MapGet("/api/history", async (ClaimsPrincipal claims, ApplicationDbContext db) =>
{
    var userId = claims.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId == null) return Results.Unauthorized();
    var history = await db.GenerationHistory.Where(h => h.UserId == userId).OrderByDescending(h => h.Timestamp).Take(50).ToListAsync();
    return Results.Ok(history);
}).WithName("GetGenerationHistory").RequireAuthorization().WithTags("History");

app.MapGet("/generate-text", async (string prompt, IGeradorTextoService geradorTextoService) =>
{
    var resultado = await geradorTextoService.GerarTextoAsync(prompt, "phi3:mini");
    return Results.Ok(new { generatedText = resultado });
}).WithName("GenerateText").RequireAuthorization().WithTags("Generation");

app.MapGet("/generate-image", async (string prompt, IGeradorImagemService geradorImagemService) =>
{
    var resultado = await geradorImagemService.GerarImagemAsync(prompt, "digital art");
    return Results.Ok(new { base64Images = resultado });
}).WithName("GenerateImage").RequireAuthorization().WithTags("Generation");

app.MapPost("/api/stripe/create-checkout-session", async ([FromBody] CreateCheckoutSessionRequest req, HttpContext httpContext, IPlanService planService) =>
{
    var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId == null) return Results.Unauthorized();
    var plan = planService.GetAllPlans().FirstOrDefault(p => p.StripePriceId == req.PriceId);
    if (plan == null) return Results.NotFound("Plano não encontrado.");

    var domain = "http://localhost:3000";
    var options = new SessionCreateOptions
    {
        PaymentMethodTypes = new List<string> { "card" },
        LineItems = new List<SessionLineItemOptions> { new() { Price = req.PriceId, Quantity = 1 } },
        Mode = "subscription",
        SuccessUrl = $"{domain}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
        CancelUrl = $"{domain}/payment/cancel",
        ClientReferenceId = userId
    };
    var service = new SessionService();
    Session session = await service.CreateAsync(options);
    return Results.Ok(new { sessionId = session.Id });
}).WithName("CreateCheckoutSession").RequireAuthorization().WithTags("Stripe");

// Webhook do Stripe FINAL E CORRIGIDO
app.MapPost("/api/stripe/webhook", async (HttpRequest request, IServiceProvider sp, ILogger<Program> logger) =>
{
    var json = await new StreamReader(request.Body).ReadToEndAsync();
    var webhookSecret = builder.Configuration["Stripe:WebhookSecret"]!;
    try
    {
        var stripeEvent = EventUtility.ConstructEvent(json, request.Headers["Stripe-Signature"], webhookSecret);
        logger.LogInformation("--> Webhook recebido: {type}", stripeEvent.Type);

        // CORREÇÃO (CS0103): Usando a string do evento, que é mais robusta.
        if (stripeEvent.Type == "checkout.session.completed")
        {
            var session = stripeEvent.Data.Object as Session;
            if (session?.PaymentStatus == "paid")
            {
                await using var scope = sp.CreateAsyncScope();
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
                var planService = scope.ServiceProvider.GetRequiredService<IPlanService>();
                
                var user = await userManager.FindByIdAsync(session.ClientReferenceId);
                if (user == null) { return Results.NotFound("Usuário não encontrado."); }

                var subscriptionService = new SubscriptionService();
                var subscription = await subscriptionService.GetAsync(session.SubscriptionId);
                var priceId = subscription.Items.Data.FirstOrDefault()?.Price.Id;

                if (string.IsNullOrEmpty(priceId)) { return Results.BadRequest("PriceId não encontrado."); }

                var newPlan = planService.GetPlanByStripePriceId(priceId);
                if (newPlan != null)
                {
                    user.StripeCustomerId = session.CustomerId;
                    user.StripeSubscriptionId = subscription.Id;
                    user.CurrentPlanName = newPlan.InternalName;
                    
                    // CORREÇÃO (CS1061): Usando a propriedade 'StartDate', como você corretamente apontou.
                    user.SubscriptionCycleStart = subscription.StartDate;
                    
                    var updateResult = await userManager.UpdateAsync(user);
                    if (!updateResult.Succeeded)
                    {
                        logger.LogError("FALHA ao atualizar usuário {email}", user.Email);
                    }
                }
            }
        }
        return Results.Ok();
    }
    catch (Exception e)
    {
        logger.LogError(e, "Erro no webhook do Stripe");
        return Results.BadRequest();
    }
}).WithName("StripeWebhook").AllowAnonymous();

app.Run();