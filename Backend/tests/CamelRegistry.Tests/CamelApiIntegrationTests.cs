using System.Net;
using System.Net.Http.Json;

namespace CamelRegistry.Tests;

public sealed class CamelApiIntegrationTests : IClassFixture<ApiWebApplicationFactory>
{
    private readonly HttpClient _client;

    public CamelApiIntegrationTests(ApiWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Post_Camels_WithInvalidHumpCount_Returns400()
    {
        var payload = new
        {
            name = "InvalidHumps",
            color = "Brown",
            humpCount = 3,
            lastFed = DateTime.UtcNow,
        };

        var response = await _client.PostAsJsonAsync("/camels", payload);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Post_Camels_WithoutName_Returns400()
    {
        var payload = new
        {
            color = "White",
            humpCount = 1,
            lastFed = DateTime.UtcNow,
        };

        var response = await _client.PostAsJsonAsync("/camels", payload);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Post_Get_Delete_Camel_Works_EndToEnd()
    {
        var createPayload = new
        {
            name = "E2E",
            color = "Tan",
            humpCount = 2,
            lastFed = DateTime.UtcNow,
        };

        var create = await _client.PostAsJsonAsync("/camels", createPayload);
        Assert.Equal(HttpStatusCode.Created, create.StatusCode);
        Assert.NotNull(create.Headers.Location);

        var location = create.Headers.Location!.ToString();

        var get = await _client.GetAsync(location);
        Assert.Equal(HttpStatusCode.OK, get.StatusCode);

        var delete = await _client.DeleteAsync(location);
        Assert.Equal(HttpStatusCode.NoContent, delete.StatusCode);

        var getAfterDelete = await _client.GetAsync(location);
        Assert.Equal(HttpStatusCode.NotFound, getAfterDelete.StatusCode);
    }
}
