using Microsoft.EntityFrameworkCore;
using Uzser.CoreServices.Data;
using Uzser.CoreServices.Services.Interfaces;
using Uzser.CoreServices.Services.Implementations;
using Uzser.CoreServices.Utils;
using Uzser.CoreServices.Models.Entities;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Swagger (API dökümantasyonu)
builder.Services.AddScoped<ILogService, LogService>();
builder.Services.AddHttpContextAccessor();


builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddScoped<ISalesHeaderService, SalesHeaderService>();
builder.Services.AddScoped<ISalesLineService, SalesLineService>();
builder.Services.AddScoped<IVehicleService, VehiclesService>();
builder.Services.AddScoped<IUzserCustomerService, UzserCustomerService>();
builder.Services.AddScoped<ILookupService, LookupService>();
builder.Services.AddScoped<IUtilityService, UtilityService>();
builder.Services.AddScoped<IFormDocumentService, FormDocumentService>();
builder.Services.AddScoped<IMarkaService, MarkaService>();
builder.Services.AddScoped<IModelService, ModelService>();
builder.Services.AddScoped<IOrderSeriesService, OrderSeriesService>();
builder.Services.AddScoped<IUserMappingService, UserMappingService>();
builder.Services.AddMemoryCache();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Veritabanı bağlantısı
builder.Services.AddDbContext<UzserDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("UzserDbConnection")));

builder.Services.AddDbContext<ErpDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ErpConnection")));

// Dependency Injection (İleride servisler eklenecekse buraya eklenir)
// builder.Services.AddScoped<IOrderService, OrderService>();

var app = builder.Build();

// Middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // HTTPS zorlama, opsiyonel

app.UseCors();
app.UseStaticFiles();
app.UseMiddleware<ErrorHandlerMiddleware>();
app.UseAuthorization();
app.MapControllers();

app.Run();

