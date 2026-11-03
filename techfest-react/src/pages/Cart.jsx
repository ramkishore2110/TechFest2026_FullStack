// Reads the shared cart from CartContext - no props needed.
import { useCart } from "../context/useCart.js";

export default function Cart() {
  const { cart, removeFromCart, total } = useCart();

  if (cart.length === 0) {
    return <section><h2>Cart</h2><p>Your cart is empty.</p></section>;
  }

  return (
    <section>
      <h2>Cart</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} - Rs. {item.fee}
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p><strong>Total fee: Rs. {total}</strong></p>
    </section>
  );
}
