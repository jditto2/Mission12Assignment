using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backendAPI.Data
{
    public class Book
    {
        [Key]
        [Column("BookID")]
        public int BookId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Author { get; set; }

        [Required]
        public string Publisher { get; set; }

        [Required]
        public string ISBN { get; set; }

        [Required]
        public string Classification { get; set; }

        [Required]
        public string Category { get; set; }  // Optional if unused in frontend

        [Required]
        public int PageCount { get; set; }

        [Required]
        public decimal Price { get; set; }
    }
}
