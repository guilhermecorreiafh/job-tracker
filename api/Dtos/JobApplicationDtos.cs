using System.ComponentModel.DataAnnotations;
using JobTracker.Api.Models;

namespace JobTracker.Api.Dtos;

public record JobApplicationRequest(
    [Required, MaxLength(100)] string Company,
    [Required, MaxLength(150)] string Role,
    [Url, MaxLength(500)] string? Url,
    Stage Stage = Stage.Wishlist,
    DateOnly? AppliedAt = null,
    [MaxLength(4000)] string? Notes = null);

public record JobApplicationResponse(
    int Id,
    string Company,
    string Role,
    string? Url,
    Stage Stage,
    DateOnly? AppliedAt,
    string? Notes,
    DateTime CreatedAt);