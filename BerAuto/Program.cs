using Microsoft.EntityFrameworkCore;
using BerAuto.DataContext.Context;
using BerAuto.Services;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseSqlServer("Server=adatb-mssql.mik.uni-pannon.hu,2019;Database=h10_s4buby;User Id=h10_s4buby;" +
        "Password=fwW4azqkS6;TrustServerCertificate=True;"));

builder.Services.AddScoped<ICarService, CarService>();


// AutoMapper Config
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

//swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Rendszfejl 27 - BerAuto API", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Rendszfejl - BerAuto API v1"));
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
