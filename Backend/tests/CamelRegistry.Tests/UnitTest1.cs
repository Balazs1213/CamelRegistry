using System.ComponentModel.DataAnnotations;
using CamelRegistry.API.Models;

namespace CamelRegistry.Tests;

public class CamelValidationTests
{
    [Fact]
    public void HumpCount_Outside_1_Or_2_Is_Invalid()
    {
        var camel = new Camel
        {
            Name = "Gobi",
            Color = "Tan",
            HumpCount = 3,
            LastFed = DateTime.UtcNow,
        };

        var errors = Validate(camel);

        Assert.Contains(errors, e => e.MemberNames.Contains(nameof(Camel.HumpCount)));
    }

    [Theory]
    [InlineData(1)]
    [InlineData(2)]
    public void HumpCount_1_Or_2_Is_Valid(int humpCount)
    {
        var camel = new Camel
        {
            Name = "Sahara",
            HumpCount = humpCount,
            LastFed = DateTime.UtcNow,
        };

        var errors = Validate(camel);

        Assert.Empty(errors);
    }

    private static List<ValidationResult> Validate(object instance)
    {
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(instance, new ValidationContext(instance), results, validateAllProperties: true);
        return results;
    }
}