import { useState } from 'react';
import '../App.css';
import BookList from '../components/BookList';
import CategoryFilter from '../components/CategoryFilter';
import WelcomeBand from '../components/WelcomeBand';
import CartSummary from '../components/CartSummary';
import { Link } from 'react-router-dom';

function BooksPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  return (
    <div className="container-fluid px-4">
      <CartSummary />
      <WelcomeBand />

      {/* Link to Admin Page */}
      <div className="text-end mb-3">
        <Link to="/adminbooks" className="btn btn-outline-secondary">
          Go to Admin Dashboard
        </Link>
      </div>

      <div className="row">
        <div className="col-md-3">
          <CategoryFilter
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>
        <div className="col-md-9">
          <BookList selectedCategories={selectedCategories} />
        </div>
      </div>
    </div>
  );
}

export default BooksPage;
