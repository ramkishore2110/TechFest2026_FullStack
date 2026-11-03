// Navbar uses React Router links and shared theme, cart and authentication state.
import { Link } from "react-router-dom";
import { useTheme } from "../context/useTheme.js";
import { useCart } from "../context/useCart.js";
import { useAuth } from "../context/useAuth.js";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { cart } = useCart();
  const { user, loading, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      window.alert(error.message);
    }
  }

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/events">Events</Link>
      <Link to="/register">Register</Link>
      <Link to="/gallery">Gallery</Link>
      <Link to="/contact">Contact Us</Link>
      <Link to="/cart">Cart ({cart.length})</Link>
      {!loading && (user ? (
        <>
          <Link to="/my-registrations">My Registrations</Link>
          <span className="nav-user">Hi, {user.name}</span>
          <button className="theme-btn" onClick={handleLogout}>Logout</button>
        </>
      ) : <Link to="/login">Login</Link>)}
      <button className="theme-btn" onClick={toggleTheme}>
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </button>
    </nav>
  );
}
