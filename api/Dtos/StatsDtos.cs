using JobTracker.Api.Models;

namespace JobTracker.Api.Dtos;

public record StageCount(Stage Stage, int Count);
public record WeekCount(DateOnly WeekStart, int Count);
public record StatsResponse(
    int Total,
    List<StageCount> ByStage,
    List<WeekCount> ByWeek,
    double? AverageResponseDays);