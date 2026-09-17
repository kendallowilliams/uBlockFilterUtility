namespace uBlockFilterUtility.Models
{
    public class FilterModel
    {
        public int? Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public Dictionary<string, string>? Parameters { get; set; } = new Dictionary<string, string>();

        public string Template { get; set; } = string.Empty;
    }
}
