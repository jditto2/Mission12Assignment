import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CartItem } from "../types/CartItem";


function CartPage () {
    const navigate = useNavigate();
    const { cart, removeFromCart } = useCart();

    return (
        <div>
            <h2>Your Cart</h2>
            <div>
                {cart.length === 0 ?
                <p>Your cart is empty.</p> :
                <ul className="flex">
                    {cart.map((item: CartItem) => 
                        <li key={item.bookId}>
                                {item.quantity}x {item.bookTitle} — ${item.price.toFixed(2)} each<br />
                                Subtotal: ${(item.price * item.quantity).toFixed(2)}
                            <button onClick={() => removeFromCart(item.bookId)}>
                                Remove
                            </button>
                        </li>
                    )}
                </ul>
                }</div>
                    <h3>
                        Total: $
                        {cart.reduce((total, item) => {
                            const price = Number(item.price) || 0;
                            const quantity = Number(item.quantity) || 0;
                            return total + price * quantity;
                        }, 0).toFixed(2)}
                        </h3>
                    <button>Checkout</button>
            <button onClick={() => navigate('/books')}>Continue Browsing</button>
        </div>
    )
}

export default CartPage;