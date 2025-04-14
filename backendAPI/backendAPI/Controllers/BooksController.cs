using backendAPI.Data;
using Microsoft.AspNetCore.Mvc;

namespace backendAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BooksDbContext _booksContext;

        public BooksController(BooksDbContext temp)
        {
            _booksContext = temp;
        }

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 10, int pageNum = 1, string? sortBy = null, [FromQuery] List<string>? projectTypes = null)
        {
            var query = _booksContext.Books.AsQueryable();

            if (!string.IsNullOrEmpty(sortBy))
            {
                if (sortBy.ToLower() == "title_asc")
                    query = query.OrderBy(b => b.Title);
                else if (sortBy.ToLower() == "title_desc")
                    query = query.OrderByDescending(b => b.Title);
            }

            if (projectTypes != null && projectTypes.Any())
            {
                query = query.Where(p => projectTypes.Contains(p.Category));
            }

            var totalNumBooks = query.Count();

            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new { Books = books, TotalNumBooks = totalNumBooks });
        }

        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories()
        {
            var bookTypes = _booksContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();

            return Ok(bookTypes);
        }

        [HttpPost("Add")]
        public IActionResult AddBook([FromBody] Book book)
        {
            _booksContext.Books.Add(book);
            _booksContext.SaveChanges();
            return Ok(book);
        }

        [HttpPut("Update/{id}")]
        public IActionResult UpdateBook(int id, [FromBody] Book updatedBook)
        {
            var book = _booksContext.Books.FirstOrDefault(b => b.BookId == id);
            if (book == null) return NotFound();

            book.Title = updatedBook.Title;
            book.Author = updatedBook.Author;
            book.Publisher = updatedBook.Publisher;
            book.ISBN = updatedBook.ISBN;
            book.Classification = updatedBook.Classification;
            book.Category = updatedBook.Category;
            book.PageCount = updatedBook.PageCount;
            book.Price = updatedBook.Price;

            _booksContext.SaveChanges();
            return Ok(book);
        }

        [HttpDelete("Delete/{id}")]
        public IActionResult DeleteBook(int id)
        {
            var book = _booksContext.Books.FirstOrDefault(b => b.BookId == id);
            if (book == null) return NotFound();

            _booksContext.Books.Remove(book);
            _booksContext.SaveChanges();
            return Ok();
        }
    }
}
