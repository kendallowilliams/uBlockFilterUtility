using Microsoft.EntityFrameworkCore;
using uBlockFilterUtility.Entities;

namespace uBlockFilterUtility.DbContexts
{
    public class uBlockContext : DbContext
    {
        public DbSet<Filter> Filters { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlite("Data Source=Data/uBlock.db");
        }
    }
}
