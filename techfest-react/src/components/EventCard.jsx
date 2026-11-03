// EventCard receives one event through props and adds it to the shared cart.
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart.js";

export default function EventCard({ event }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="card">
      <h3>{event.name}</h3>
      <p>Category: {event.category}</p>
      <p>Fee: Rs. {event.fee}</p>
      <p>Seats left: {event.seats}</p>
      {event.description && <p>{event.description}</p>}

      {event.seats === 0 ? (
        <button disabled>SOLD OUT</button>
      ) : (
        <button onClick={() => navigate(`/register?event=${event.id}`)}>Register</button>
      )}

      <button className="cart-btn" onClick={() => addToCart(event)}>
        Add to Cart
      </button>
    </div>
  );
}
