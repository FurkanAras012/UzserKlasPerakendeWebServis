using Microsoft.EntityFrameworkCore;
using Uzser.CoreServices.Models.Entities;

namespace Uzser.CoreServices.Data
{
    public class ErpDbContext : DbContext
    {
        public ErpDbContext(DbContextOptions<ErpDbContext> options) : base(options) { }

        public DbSet<Stock> Stocks { get; set; }
        public DbSet<Departments> Departments { get; set; }
        public DbSet<Customer> Customers { get; set; }  // ✅ BU SATIR KRİTİK

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Stock>().HasNoKey().ToView("UZS_VW_STOCK");
            modelBuilder.Entity<Customer>().HasNoKey().ToView("UZS_VW_CUSTOMER");
            modelBuilder.Entity<Departments>().HasNoKey().ToView("UZS_VW_DEPARTMENTS");
        }
    }
}