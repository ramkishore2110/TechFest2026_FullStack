import { useContext } from "react";
import { CartContext } from "./CartContextValue.js";

export function useCart() {
  return useContext(CartContext);
}
