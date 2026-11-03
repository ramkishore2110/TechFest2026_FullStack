import { useState } from "react";
import { CartContext } from "./CartContextValue.js";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(event) {
    if (cart.find((item) => item.id === event.id)) return;
    setCart([...cart, event]);
  }

  function removeFromCart(id) {
    setCart(cart.filter((item) => item.id !== id));
  }

  const total = cart.reduce((sum, item) => sum + item.fee, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, total }}>
      {children}
    </CartContext.Provider>
  );
}
