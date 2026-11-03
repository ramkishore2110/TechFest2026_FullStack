import { useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";
import { AuthContext } from "./AuthContextValue.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    apiRequest("/auth/me")
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function login(email, password) {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password }
    });
    setUser(data.user);
    return data.user;
  }

  async function register(name, email, password) {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: { name, email, password }
    });
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
