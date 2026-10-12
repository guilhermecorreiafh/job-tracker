using JobTracker.Api.Models;

namespace JobTracker.Tests;

public class JobApplicationStageTests
{
    private static readonly DateTime Day1 = new(2026, 10, 1, 12, 0, 0, DateTimeKind.Utc);
    private static readonly DateTime Day5 = new(2026, 10, 5, 12, 0, 0, DateTimeKind.Utc);

    [Fact]
    public void StartAt_RegistraEtapaInicialSemOrigem()
    {
        var application = new JobApplication();

        application.StartAt(Stage.Applied, Day1);

        Assert.Equal(Stage.Applied, application.Stage);
        var change = Assert.Single(application.StageChanges);
        Assert.Null(change.FromStage);
        Assert.Equal(Stage.Applied, change.ToStage);
        Assert.Equal(Day1, change.ChangedAt);
    }

    [Fact]
    public void MoveTo_QuandoEtapaMuda_RegistraOrigemEDestino()
    {
        var application = new JobApplication();
        application.StartAt(Stage.Applied, Day1);

        var moved = application.MoveTo(Stage.Interview, Day5);

        Assert.True(moved);
        Assert.Equal(Stage.Interview, application.Stage);
        Assert.Equal(2, application.StageChanges.Count);

        var last = application.StageChanges[^1];
        Assert.Equal(Stage.Applied, last.FromStage);
        Assert.Equal(Stage.Interview, last.ToStage);
        Assert.Equal(Day5, last.ChangedAt);
    }

    [Fact]
    public void MoveTo_QuandoEtapaContinuaIgual_NaoRegistraNada()
    {
        var application = new JobApplication();
        application.StartAt(Stage.Applied, Day1);

        var moved = application.MoveTo(Stage.Applied, Day5);

        Assert.False(moved);
        Assert.Single(application.StageChanges);
    }

    [Fact]
public void DaysToFirstResponse_QuandoHouveResposta_RetornaDiasEntreAplicadoEProximaEtapa()
{
    var application = new JobApplication();
    var applied = new DateTime(2026, 10, 1, 12, 0, 0, DateTimeKind.Utc);

    application.StartAt(Stage.Applied, applied);
    application.MoveTo(Stage.Interview, applied.AddDays(7));

    Assert.Equal(7, application.DaysToFirstResponse());
}

[Fact]
public void DaysToFirstResponse_QuandoAindaNaoHouveResposta_RetornaNulo()
{
    var application = new JobApplication();
    application.StartAt(Stage.Applied, DateTime.UtcNow);

    Assert.Null(application.DaysToFirstResponse());
}
}