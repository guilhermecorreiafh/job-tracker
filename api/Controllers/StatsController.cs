using JobTracker.Api.Data;
using JobTracker.Api.Dtos;
using JobTracker.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Api.Controllers;

[ApiController]
[Route("api/stats")]
public class StatsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<StatsResponse> Get()
    {
        var applications = await db.JobApplications
            .Include(a => a.StageChanges)
            .ToListAsync();

        var byStage = Enum.GetValues<Stage>()
            .Select(s => new StageCount(s, applications.Count(a => a.Stage == s)))
            .ToList();

        var byWeek = applications
            .Where(a => a.AppliedAt is not null)
            .GroupBy(a => StartOfWeek(a.AppliedAt!.Value))
            .OrderBy(g => g.Key)
            .Select(g => new WeekCount(g.Key, g.Count()))
            .ToList();

        var responseDays = applications
            .Select(a => a.DaysToFirstResponse())
            .OfType<double>()
            .ToList();

        double? average = responseDays.Count > 0
            ? Math.Round(responseDays.Average(), 1)
            : null;

        return new StatsResponse(applications.Count, byStage, byWeek, average);
    }

    private static DateOnly StartOfWeek(DateOnly date) =>
        date.AddDays(-(((int)date.DayOfWeek + 6) % 7));
}