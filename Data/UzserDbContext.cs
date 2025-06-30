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
        public DbSet<OrderSeries> OrderSeries { get; set; }

        public DbSet<Vehicles> Vehicles { get; set; }

        public DbSet<UzserCustomer> UzserCustomers { get; set; }

        public DbSet<Marka> Marka { get; set; }
        public new DbSet<Model> Model { get; set; }
        
        // User Mapping Tables
        public DbSet<FlowUser> FlowUsers { get; set; }
        public DbSet<TigerUser> TigerUsers { get; set; }
        public DbSet<UserMapping> UserMappings { get; set; }
    }
}
