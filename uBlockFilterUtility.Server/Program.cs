using Microsoft.EntityFrameworkCore;
using uBlockFilterUtility.DbContexts;
using uBlockFilterUtility.Server.Settings;
using uBlockFilterUtility.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(config =>
{
    config.JsonSerializerOptions.PropertyNamingPolicy = null;
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddScoped<FilterService>();
builder.Services.AddDbContextFactory<uBlockContext>(options =>
{
    var config = builder.Configuration.GetSection(nameof(AppSettings)).Get<AppSettings>();

    if (string.IsNullOrWhiteSpace(config?.SqlLiteDataSource)) throw new NullReferenceException(nameof(AppSettings.SqlLiteDataSource));

    string dataSourcePath = Path.GetDirectoryName(config.SqlLiteDataSource)!;

    if (!Directory.Exists(dataSourcePath)) Directory.CreateDirectory(dataSourcePath);

    options.UseSqlite($"Data Source={config.SqlLiteDataSource}");
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<uBlockContext>();

    await context.Database.MigrateAsync();
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
