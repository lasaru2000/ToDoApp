namespace todoapi.Models
{
    public class Content
    {
        [System.ComponentModel.DataAnnotations.Key]
        public int contentId { get; set; }

        public Guid id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string priority { get; set; }
    }
}
