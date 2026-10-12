using JobTracker.Api.Models;

namespace JobTracker.Api.Data;

public static class DemoSeeder
{
    private record Demo(string Company, string Role, int DaysAgo, params (Stage Stage, int DaysAfter)[] Moves);

    private static readonly Demo[] Applied =
    [
        new("Nimbus Tech", "Desenvolvedor .NET Júnior", 40, (Stage.Interview, 6), (Stage.TechnicalTest, 12), (Stage.Offer, 20)),
        new("Atlântica Sistemas", "Desenvolvedor Full Stack Júnior", 38, (Stage.Interview, 9), (Stage.Closed, 15)),
        new("Porto Digital Labs", "Estágio Backend", 35, (Stage.Closed, 7)),
        new("Vértice Software", "Desenvolvedor C# Júnior", 33, (Stage.Interview, 4), (Stage.TechnicalTest, 10)),
        new("Lumen Pay", "Desenvolvedor React Júnior", 30),
        new("Cais Tecnologia", "Analista de Sistemas Júnior", 28, (Stage.Interview, 5)),
        new("Orla Cloud", "Desenvolvedor Backend Júnior", 26, (Stage.Interview, 8), (Stage.Closed, 14)),
        new("Maré Logística", "Desenvolvedor .NET Júnior", 21, (Stage.TechnicalTest, 6)),
        new("Farol Data", "Analista de Dados Júnior", 19),
        new("Brisa Apps", "Desenvolvedor Full Stack Júnior", 14, (Stage.Interview, 3)),
        new("Quilha Systems", "Desenvolvedor Backend Júnior", 10),
        new("Rumo Labs", "Estágio Full Stack", 6),
        new("Âncora Dev", "Desenvolvedor C# Júnior", 3),
    ];

    private static readonly (string Company, string Role)[] Wishlist =
    [
        ("Estuário Tech", "Desenvolvedor .NET Júnior"),
        ("Delta Software", "Desenvolvedor Full Stack Júnior"),
    ];

    public static void Seed(AppDbContext db)
    {
        if (db.JobApplications.Any())
            return;

        var today = DateTime.UtcNow.Date.AddHours(12);

        foreach (var demo in Applied)
        {
            var appliedAt = today.AddDays(-demo.DaysAgo);

            var application = new JobApplication
            {
                Company = demo.Company,
                Role = demo.Role,
                AppliedAt = DateOnly.FromDateTime(appliedAt),
                CreatedAt = appliedAt,
            };

            application.StartAt(Stage.Applied, appliedAt);

            foreach (var (stage, daysAfter) in demo.Moves)
                application.MoveTo(stage, appliedAt.AddDays(daysAfter));

            db.JobApplications.Add(application);
        }

        foreach (var (company, role) in Wishlist)
        {
            var application = new JobApplication { Company = company, Role = role, CreatedAt = today };
            application.StartAt(Stage.Wishlist, today);
            db.JobApplications.Add(application);
        }

        db.SaveChanges();
    }
}