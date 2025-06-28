using Microsoft.EntityFrameworkCore;
using Uzser.CoreServices.Models.Entities;

namespace Uzser.CoreServices.Data
{
    public class UzserDbContext : DbContext
    {
        public UzserDbContext(DbContextOptions<UzserDbContext> options)
            : base(options)
        {
        }

        public DbSet<SalesHeader> SalesHeader { get; set; }
        public DbSet<SalesLine> SalesLine { get; set; }
        public DbSet<LogEntry> Logs { get; set; }
        public DbSet<FormDocument> FormDocuments { get; set; }

        public DbSet<Vehicles> Vehicles { get; set; }

        public DbSet<UzserCustomer> UzserCustomers { get; set; }

        public DbSet<Marka> Marka { get; set; }
              public DbSet<Model> Model { get; set; }
    }
}
