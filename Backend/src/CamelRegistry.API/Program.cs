using CamelRegistry.API.Data;
using CamelRegistry.API.Endpoints;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
	options.AddPolicy("AngularDev", policy =>
	{
		policy
			.WithOrigins("http://localhost:4200")
			.AllowAnyHeader()
			.AllowAnyMethod();
	});
});

builder.Services.AddDbContext<CamelDbContext>(options =>
	options.UseSqlite("Data Source=camels.db"));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
	var db = scope.ServiceProvider.GetRequiredService<CamelDbContext>();
	db.Database.EnsureCreated();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AngularDev");

app.MapGet("/", () => Results.Redirect("/swagger"));

app.MapCamelEndpoints();

app.Run();

public partial class Program
{
}
