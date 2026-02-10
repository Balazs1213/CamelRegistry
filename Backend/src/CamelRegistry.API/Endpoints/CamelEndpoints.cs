using System.ComponentModel.DataAnnotations;
using CamelRegistry.API.Data;
using CamelRegistry.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CamelRegistry.API.Endpoints;

public static class CamelEndpoints
{
    public static IEndpointRouteBuilder MapCamelEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app
            .MapGroup("/camels")
            .WithTags("Camels");

        group.MapPost("", async (Camel camel, CamelDbContext db) =>
        {
            camel.Id = 0;

            if (!TryValidate(camel, out var errors))
            {
                return Results.ValidationProblem(errors);
            }

            db.Camels.Add(camel);
            await db.SaveChangesAsync();

            return Results.Created($"/camels/{camel.Id}", camel);
        })
        .WithName("CreateCamel")
        ;

        group.MapGet("", async (CamelDbContext db) =>
        {
            var camels = await db.Camels
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(camels);
        })
        .WithName("ListCamels")
        ;

        group.MapGet("/{id:int}", async (int id, CamelDbContext db) =>
        {
            var camel = await db.Camels.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
            return camel is null ? Results.NotFound() : Results.Ok(camel);
        })
        .WithName("GetCamel")
        ;

        group.MapPut("/{id:int}", async (int id, Camel input, CamelDbContext db) =>
        {
            if (!TryValidate(input, out var errors))
            {
                return Results.ValidationProblem(errors);
            }

            var camel = await db.Camels.FirstOrDefaultAsync(c => c.Id == id);
            if (camel is null)
            {
                return Results.NotFound();
            }

            camel.Name = input.Name;
            camel.Color = input.Color;
            camel.HumpCount = input.HumpCount;
            camel.LastFed = input.LastFed;

            await db.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithName("UpdateCamel")
        ;

        group.MapDelete("/{id:int}", async (int id, CamelDbContext db) =>
        {
            var camel = await db.Camels.FirstOrDefaultAsync(c => c.Id == id);
            if (camel is null)
            {
                return Results.NotFound();
            }

            db.Camels.Remove(camel);
            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .WithName("DeleteCamel")
        ;

        return app;
    }

    private static bool TryValidate(Camel camel, out Dictionary<string, string[]> errors)
    {
        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(camel);

        var isValid = Validator.TryValidateObject(
            camel,
            validationContext,
            validationResults,
            validateAllProperties: true);

        errors = validationResults
            .GroupBy(r => r.MemberNames.FirstOrDefault() ?? string.Empty)
            .ToDictionary(
                g => g.Key,
                g => g.Select(r => r.ErrorMessage ?? "Validation error").ToArray());

        return isValid;
    }
}
