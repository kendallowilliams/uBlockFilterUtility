using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using uBlockFilterUtility.DbContexts;
using uBlockFilterUtility.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(config =>
    {
        //config.JsonSerializerOptions.PropertyNameCaseInsensitive = false;
        config.JsonSerializerOptions.PropertyNamingPolicy = null;
    });
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddScoped<FilterService>();
builder.Services.AddDbContextFactory<uBlockContext>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<uBlockContext>();

    //await context.Database.MigrateAsync();
}

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
