import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import {
  fetchBooks,
  addBook,
  updateBook,
  deleteBook,
} from "../api/Books.api"; // ✅ Import the API functions
import { useNavigate } from "react-router-dom"; // For navigation back to regular books page

const AdminBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [formData, setFormData] = useState<Partial<Book>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); // Manage the modal visibility

  const navigate = useNavigate(); // Hook for navigation to other pages

  // Fetch all books from the backend
  const fetchAllBooks = async () => {
    try {
      const response = await fetchBooks(100, 1, "title_asc"); // Fetch all books, no pagination
      setBooks(response.books);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateBook(editingId, formData as Book); // Update existing book
      } else {
        await addBook(formData as Book); // Add new book
      }
      setFormData({});
      setEditingId(null);
      fetchAllBooks(); // Refetch books to show updated list
    } catch (error) {
      console.error("Error submitting book:", error);
    }
  };

  // Start editing an existing book
  const startEdit = (book: Book) => {
    setFormData(book);
    setEditingId(book.bookId);
  };

  // Handle book deletion
  const handleDelete = async () => {
    if (deletingId !== null) {
      console.log("Deleting book with ID:", deletingId); // Add logging here to verify book ID

      try {
        await deleteBook(deletingId); // Use the API to delete the book
        console.log(`Book with ID ${deletingId} deleted successfully.`); // Log successful deletion
        setIsDeleting(false); // Close the modal
        fetchAllBooks(); // Refetch books
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (bookId: number) => {
    console.log("Opening delete modal for book ID:", bookId); // Log when modal is opened
    setDeletingId(bookId);
    setIsDeleting(true);
  };

  // Close the delete confirmation modal
  const closeDeleteModal = () => {
    setIsDeleting(false);
    setDeletingId(null);
  };

  // Go back to the regular books page
  const goBackToBooksPage = () => {
    navigate("/books");
  };

  return (
    <div className="container mt-4">
      <h2>Admin Book Management</h2>

      {/* Button to go back to the regular books page */}
      <button className="btn btn-secondary mb-4" onClick={goBackToBooksPage}>
        Back to Books Page
      </button>

      <form onSubmit={handleSubmit} className="mb-4">
        {[
          "title",
          "author",
          "publisher",
          "isbn",
          "classification",
          "category",
        ].map((field) => (
          <input
            key={field}
            className="form-control my-1"
            placeholder={field.toUpperCase()}
            value={(formData as any)[field] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [field]: e.target.value })
            }
          />
        ))}
        <input
          className="form-control my-1"
          placeholder="Page Count"
          type="number"
          value={formData.pageCount || ""}
          onChange={(e) =>
            setFormData({ ...formData, pageCount: parseInt(e.target.value) })
          }
        />
        <input
          className="form-control my-1"
          placeholder="Price"
          type="number"
          step="0.01"
          value={formData.price || ""}
          onChange={(e) =>
            setFormData({ ...formData, price: parseFloat(e.target.value) })
          }
        />
        <button type="submit" className="btn btn-primary mt-2">
          {editingId ? "Update Book" : "Add Book"}
        </button>
      </form>

      {/* Displaying all the books */}
      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.bookId}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.category}</td> {/* Displaying category */}
                <td>${b.price.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => startEdit(b)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => openDeleteModal(b.bookId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {isDeleting && (
  <div
    className="modal-overlay"
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}
  >
    <div
      className="modal-content"
      style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        textAlign: 'center',
        zIndex: 10000,
        width: '100%',
        maxWidth: '400px',
      }}
    >
      <h4>Confirm Deletion</h4>
      <p>Are you sure you want to delete this book?</p>
      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-danger" onClick={handleDelete}>
          Yes, Delete
        </button>
        <button className="btn btn-secondary" onClick={closeDeleteModal}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default AdminBooksPage;
