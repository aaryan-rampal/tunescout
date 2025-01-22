import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: { email: string } | null;
  login: (userData: { email: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    // Check if user is already logged in (persisted via localStorage)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: { email: string }) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Persist login
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Clear user session
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
