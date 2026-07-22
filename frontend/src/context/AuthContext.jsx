import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Resolve user id from whichever field the backend returned
export const resolveUid = (user) =>
  user?.id ?? user?.customerId ?? user?.providerId ??
  user?.userId ?? null;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      // Clear stale sessions with no token
      if (!parsed.token) {
        localStorage.removeItem("auth_user");
        return null;
      }
      // Normalize role in case old session has "ROLE_CUSTOMER" etc.
      const rawRole = (parsed.role || "").toUpperCase();
      if (rawRole.includes("ADMIN")) parsed.role = "ADMIN";
      else if (rawRole.includes("PROVIDER")) parsed.role = "PROVIDER";
      else if (rawRole.includes("CUSTOMER")) parsed.role = "CUSTOMER";
      return parsed;
    } catch {
      localStorage.removeItem("auth_user");
      return null;
    }
  });

  const login = (userData) => {
    localStorage.setItem("auth_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
