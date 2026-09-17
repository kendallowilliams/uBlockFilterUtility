namespace uBlockFilterUtility.Entities
{
    public class Filter
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public string? ParametersJson { get; set; }

        public required string Template { get; set; }
    }
}
