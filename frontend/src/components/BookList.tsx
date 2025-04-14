import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("title_asc");

  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `projectTypes=${encodeURIComponent(cat)}`)
        .join("&");

        const response = await fetch(
          `https://ambitious-wave-035cc7a1e.6.azurestaticapps.net/api/Books/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortBy=${sortBy}${
            selectedCategories.length ? `&${categoryParams}` : ""
          }`
        );
        

      if (!response.ok) {
        console.error("Failed to fetch books:", response.statusText);
        return;
      }

      const data = await response.json();

      if (Array.isArray(data.books) && typeof data.totalNumBooks === "number") {
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize)); // Adjust pagination
      } else {
        console.error("Unexpected backend format:", data);
      }
    };

    fetchBooks();
  }, [pageSize, pageNum, sortBy, selectedCategories]);

  return (
    <div className="my-4">
      <h1 className="text-center mb-4">Books</h1>

      <div className="row">
        {books.map((b) => (
          <div key={b.bookId} className="col-md-6 mb-4">
            <div className="card h-100 shadow">
              <div className="card-body">
                <h5 className="card-title text-primary">{b.title}</h5>
                <ul className="list-unstyled">
                  <li><strong>Author:</strong> {b.author}</li>
                  <li><strong>Publisher:</strong> {b.publisher}</li>
                  <li><strong>ISBN:</strong> {b.isbn}</li>
                  <li><strong>Book Classification:</strong> {b.classification}</li>
                  <li><strong>Book Page Count:</strong> {b.pageCount}</li>
                  <li>
                    <strong>Book Price:</strong>{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(b.price)}
                  </li>
                </ul>
                <div className="d-flex justify-content-between mt-3">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate(`/BuyPage/${b.title}/${b.bookId}/${b.price}`)}
                  >
                    Purchase
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      addToCart({
                        bookId: b.bookId,
                        bookTitle: b.title,
                        price: b.price,
                        quantity: 1,
                      })
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between align-items-center my-3">
        <label>
          <strong>Sort By:</strong>{" "}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPageNum(1);
            }}
          >
            <option value="title_asc">Title Asc (A-Z)</option>
            <option value="title_desc">Title Desc (Z-A)</option>
          </select>
        </label>

        <label>
          <strong>Results per page:</strong>{" "}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageNum(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </label>
      </div>

      <div className="text-center">
        <button
          className="btn btn-secondary mx-1"
          disabled={pageNum === 1}
          onClick={() => setPageNum(pageNum - 1)}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            className={`btn mx-1 ${
              pageNum === i + 1 ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setPageNum(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="btn btn-secondary mx-1"
          disabled={pageNum === totalPages}
          onClick={() => setPageNum(pageNum + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BookList;
