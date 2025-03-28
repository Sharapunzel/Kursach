using APISampleWithSockets.API.Hubs;
using APISampleWithSockets.Application.Options;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;

namespace APISampleWithSockets.Application.Services
{
    public class SocketsInfoUpdater(
        SelectedTagManager selectedTagManager,
        IHubContext<LiveHub> hubContext,
        IOptions<SocketsOptions> socketsOptions
        ) : BackgroundService
    {
        private readonly Random _rnd = new Random();
        private readonly SocketsOptions _options = socketsOptions.Value;

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            while(!cancellationToken.IsCancellationRequested)
            {
                await UpdateTagValues();
                await Task.Delay(_options.UpdateInterval, cancellationToken);
            }
        }

        private async Task UpdateTagValues()
        {
            foreach (var tag in selectedTagManager.GetAllSelectedTags())
            {
                double tagValue = _rnd.Next(100);

                await hubContext.Clients.Group(tag).SendAsync("RecieveTagUpdate", tagValue);
            }


        }

    }
}
