using Microsoft.EntityFrameworkCore;
using backendAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Configure CORS to allow frontend on port 3001
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3001")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<BooksDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookConnection")));

var app = builder.Build();

// Use the defined CORS policy
app.UseCors("AllowReactApp");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
