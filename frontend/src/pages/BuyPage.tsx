import { useNavigate, useParams } from "react-router-dom";
import WelcomeBand from "../components/WelcomeBand";
import { useCart } from "../context/CartContext";
import { CartItem } from "../types/CartItem";
import { useState } from "react";

function BuyPage() {
  const navigate = useNavigate();
  const { title, id, price } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    const bookId = parseInt(id || "0");
    const bookPrice = parseFloat(price || "0");

    const newItem: CartItem = {
      bookId,
      bookTitle: title || "No Book Found",
      price: bookPrice,
      quantity: quantity
    };

    addToCart(newItem);
    navigate("/cart");
  };

  return (
    <>
      <WelcomeBand />

      <h2>Purchase: {title}</h2>

      <div>
        <label>Quantity:</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <br />
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>

      <button onClick={() => navigate(-1)}>Go Back</button>
    </>
  );
}

export default BuyPage;
