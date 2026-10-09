using JobTracker.Api.Data;
using JobTracker.Api.Dtos;
using JobTracker.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobTracker.Api.Controllers;

[ApiController]
[Route("api/job-applications")]
public class JobApplicationsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<JobApplicationResponse>>> GetAll()
    {
        var applications = await db.JobApplications
        .OrderByDescending(a => a.CreatedAt)
        .ToListAsync();

        return applications.Select(ToResponse).ToList();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<JobApplicationResponse>> GetById(int id)
    {
        var application = await db.JobApplications.FindAsync(id);

        if (application is null)
            return NotFound();

        return ToResponse(application);
    }

    [HttpPost]
    public async Task<ActionResult<JobApplicationResponse>> Create(JobApplicationRequest request)
    {
        var application = new JobApplication();
        Apply(application, request);

        db.JobApplications.Add(application);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = application.Id }, ToResponse(application));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, JobApplicationRequest request)
    {
        var application = await db.JobApplications.FindAsync(id);

        if (application is null)
            return NotFound();

        Apply(application, request);
        await db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var application = await db.JobApplications.FindAsync(id);

        if (application is null)
            return NotFound();

        db.JobApplications.Remove(application);
        await db.SaveChangesAsync();

        return NoContent();
    }

    private static void Apply(JobApplication application, JobApplicationRequest request)
    {
        application.Company = request.Company.Trim();
        application.Role = request.Role.Trim();
        application.Url = string.IsNullOrWhiteSpace(request.Url) ? null : request.Url.Trim();
        application.Stage = request.Stage;
        application.AppliedAt = request.AppliedAt;
        application.Notes = request.Notes;
    }

    private static JobApplicationResponse ToResponse(JobApplication a) =>
        new(a.Id, a.Company, a.Role, a.Url, a.Stage, a.AppliedAt, a.Notes, a.CreatedAt);

}