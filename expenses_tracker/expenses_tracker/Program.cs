using Microsoft.EntityFrameworkCore;
using expenses_tracker.Data;
using expenses_tracker.Models;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();
// Ajouter la configuration CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy => policy.WithOrigins("http://localhost:4200") 
                       .AllowAnyHeader()
                       .AllowAnyMethod());
});
// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options=> options.UseSqlServer(builder .Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAngularApp");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

