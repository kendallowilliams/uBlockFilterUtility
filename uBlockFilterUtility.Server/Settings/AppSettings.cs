namespace uBlockFilterUtility.Server.Settings
{
    public class AppSettings
    {
        public required string SqliteDataSourceRoot { get; set; }

        public required string UboCoreNodeJsCommand { get; set; }

        public required string SqliteDataSourcePath { get; set; }

        public string SqliteDbName { get => "sqlite.db"; }

        public string SqliteBackupDbName { get => "sqlite_backup.db"; }

        public int RetentionDays { get; set; } = 15;
    }
}
