using JobTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<JobApplication> JobApplications => Set<JobApplication>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<JobApplication>(e =>
        {
            e.Property(x => x.Company).HasMaxLength(100).IsRequired();
            e.Property(x => x.Role).HasMaxLength(150).IsRequired();
            e.Property(x => x.Url).HasMaxLength(500);
            e.Property(x => x.Notes).HasMaxLength(4000);
            e.Property(x => x.Stage).HasConversion<string>().HasMaxLength(20);
        });
    }
}