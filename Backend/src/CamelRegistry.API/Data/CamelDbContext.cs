using CamelRegistry.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CamelRegistry.API.Data;

public sealed class CamelDbContext : DbContext
{
    public CamelDbContext(DbContextOptions<CamelDbContext> options) : base(options)
    {
    }

    public DbSet<Camel> Camels => Set<Camel>();
}
