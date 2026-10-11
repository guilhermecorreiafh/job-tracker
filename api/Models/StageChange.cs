namespace JobTracker.Api.Models;

public class StageChange
{
    public long Id {get; set;}
    public int JobApplicationId {get; set;}
    public JobApplication JobApplication {get; set;} = null!;
    public Stage? FromStage {get; set;}
    public Stage ToStage {get; set;}
    public DateTime ChangedAt {get; set;}

}