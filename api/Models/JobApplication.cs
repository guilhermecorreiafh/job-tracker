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
    public List<StageChange> StageChanges {get; set;} = [];

    public void StartAt(Stage stage, DateTime when)
    {
        Stage = stage;
        StageChanges.Add(new StageChange {FromStage = null, ToStage = stage, ChangedAt = when});
    }

    public bool MoveTo(Stage newStage, DateTime when)
    {
        if (newStage == Stage)
            return false;

        StageChanges.Add(new StageChange {FromStage = Stage, ToStage = Stage, ChangedAt = when});
        Stage = newStage;
        return true;
    }
}