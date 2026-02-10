using System.ComponentModel.DataAnnotations;

namespace CamelRegistry.API.Models;

public class Camel
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string? Color { get; set; }

    [Range(1, 2)]
    public int HumpCount { get; set; }

    public DateTime LastFed { get; set; } = DateTime.UtcNow;
}
