using Microsoft.AspNetCore.SignalR;

namespace APISampleWithSockets.API.Hubs
{
    public class LiveHub : Hub
    {

        public async Task Subscribe(string tagName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, tagName);
        }

        public async Task Unsubscribe(string tagName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, tagName);
        }

    }
}
