using Microsoft.EntityFrameworkCore;
using todoapi.Models;

namespace todoapi.data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Content> Content { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
