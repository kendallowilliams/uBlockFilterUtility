using Microsoft.EntityFrameworkCore;
using uBlockFilterUtility.Entities;

namespace uBlockFilterUtility.DbContexts
{
    public class uBlockContext : DbContext
    {
        public uBlockContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Filter> Filters { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {
            base.OnConfiguring(builder);
        }
    }
}
