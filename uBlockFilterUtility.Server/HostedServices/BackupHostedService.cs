using uBlockFilterUtility.Services;

namespace uBlockFilterUtility.Server.HostedServices
{
    public class BackupHostedService : IHostedService
    {
        private readonly FilterService _filterService;

        public BackupHostedService(FilterService filterService)
        {
            _filterService = filterService;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            Task.Run(async () => await _filterService.Backup(cancellationToken));
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
