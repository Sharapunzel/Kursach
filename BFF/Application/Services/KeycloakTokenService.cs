using BFF.API.Contracts;
using Newtonsoft.Json;
using System.Text;

namespace BFF.Application.Services
{
    public class KeycloakTokenService()
    {
        private const string HostUrl = "http://localhost:8080";
        private const string Realm = "master";
        private const string TokenUrl = $"/realms/{Realm}/protocol/openid-connect/token";
        private const string ContentType = "application/x-www-form-urlencoded";

        private static readonly HttpClient Http = new HttpClient { BaseAddress = new Uri(HostUrl) };

        public async Task<KeycloakRefreshResponce> RefreshAccessTokenAsync(string refreshToken)
        {
            var body = "client_id=BFF-client" +
                       $"&refresh_token={refreshToken}" +
                       "&grant_type=refresh_token" +
                       "&client_secret=hTLKs8mqVqb0NtYqiH0HXMNREFv4oHU4";

            var content = new StringContent(body, Encoding.UTF8, ContentType);

            using (var response = await Http.PostAsync(TokenUrl, content))
            {
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    return JsonConvert.DeserializeObject<KeycloakRefreshResponce>(responseContent);
                }
                else
                {
                    throw new Exception($"Ошибка при обновлении токена: {responseContent}");
                }
            }
        }
    }
}
