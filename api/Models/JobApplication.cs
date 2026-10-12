namespace JobTracker.Api.Models;

public class JobApplication
{
    public int Id { get; set; }
    public string Company { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? Url { get; set; }
    public Stage Stage { get; set; } = Stage.Wishlist;
    public DateOnly? AppliedAt { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<StageChange> StageChanges { get; set; } = [];

    public void StartAt(Stage stage, DateTime when)
    {
        Stage = stage;
        StageChanges.Add(new StageChange { FromStage = null, ToStage = stage, ChangedAt = when });
    }

    public bool MoveTo(Stage newStage, DateTime when)
    {
        if (newStage == Stage)
            return false;

        StageChanges.Add(new StageChange { FromStage = Stage, ToStage = newStage, ChangedAt = when });
        Stage = newStage;
        return true;
    }

    public double? DaysToFirstResponse()
    {
        var changes = StageChanges.OrderBy(c => c.ChangedAt).ToList();

        var applied = changes.FirstOrDefault(c => c.ToStage == Stage.Applied);
        if (applied is null)
            return null;

        var next = changes.FirstOrDefault(c => c.ChangedAt > applied.ChangedAt);
        if (next is null)
            return null;

        return (next.ChangedAt - applied.ChangedAt).TotalDays;
    }
}