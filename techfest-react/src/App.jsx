// Main application: routing plus shared theme, cart and authentication state.
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { useTheme } from "./context/useTheme.js";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Events from "./pages/Events.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Gallery from "./pages/Gallery.jsx";
import Contact from "./pages/Contact.jsx";
import Cart from "./pages/Cart.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import MyRegistrations from "./pages/MyRegistrations.jsx";
import NotFound from "./pages/NotFound.jsx";

function Layout() {
  const { theme } = useTheme();

  return (
    <div className={"app " + theme}>
      <header>
        <h1>TECH FEST 26</h1>
        <p className="tagline">Inspire, Innovate, Integrate.</p>
      </header>

      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer>
        <p>&copy; 2026 TechFest 26 - Web Technology Laboratory</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <Layout />
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
