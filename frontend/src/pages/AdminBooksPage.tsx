import { useEffect, useState } from "react";
import { Book } from "../types/Book";
import {
  fetchBooks,
  addBook,
  updateBook,
  deleteBook,
} from "../api/Books.api"; // ✅ Import the API functions

const AdminBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [formData, setFormData] = useState<Partial<Book>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); // Manage the modal visibility

  const fetchAllBooks = async () => {
    try {
      const response = await fetchBooks(10, 1, "title_asc"); // Default pagination and sorting
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
        await updateBook(editingId, formData as Book);
      } else {
        await addBook(formData as Book);
      }
      setFormData({});
      setEditingId(null);
      fetchAllBooks(); // Refetch books
    } catch (error) {
      console.error("Error submitting book:", error);
    }
  };

  const startEdit = (book: Book) => {
    setFormData(book);
    setEditingId(book.bookId);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBook(id); // Use the API to delete the book
      setIsDeleting(false); // Close the modal
      fetchAllBooks(); // Refetch books
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const openDeleteModal = (bookId: number) => {
    setDeletingId(bookId);
    setIsDeleting(true);
  };

  const closeDeleteModal = () => {
    setIsDeleting(false);
    setDeletingId(null);
  };

  return (
    <div className="container mt-4">
      <h2>Admin Book Management</h2>

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

      {/* Scrollable books list */}
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

      {isDeleting && (
        <div className="modal">
          <div className="modal-content">
            <h4>Confirm Deletion</h4>
            <p>Are you sure you want to delete this book?</p>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(deletingId!)}
            >
              Yes, Delete
            </button>
            <button className="btn btn-secondary" onClick={closeDeleteModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBooksPage;
