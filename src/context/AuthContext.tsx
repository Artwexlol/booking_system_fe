// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { User, Role } from "../types";
import { loginApi, meApi, register as registerApi } from "../api/auth";
import { http } from "../api/http";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // induláskor token + user betöltése
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const me = await meApi();
        setUser(me);
      } catch (err) {
        console.error("meApi error", err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // BEJELENTKEZÉS
  const login = async (email: string, password: string) => {
    const { token, user } = await loginApi(email, password);

    localStorage.setItem("token", token);

    // role-ok lekérése
    let roles: Role[] = [];
    try {
      const { data } = await http.get<Role[]>(`/users/${user.id}/roles`);
      roles = data;
    } catch (err) {
      console.warn("Nem sikerült role-okat betölteni", err);
    }

    setUser({ ...user, roles });
  };

  // KIJELENTKEZÉS
  const logout = async () => {
    const token = localStorage.getItem("token");
    localStorage.removeItem("token");
    setUser(null);

    if (token) {
      try {
        await http.post("/auth/logout", {});
      } catch {
      }
    }
  };

  // REGISZTRÁCIÓ
  const register = async (name: string, email: string, password: string) => {
    await registerApi(name, email, password);
  };

  const value: AuthContextValue = {
    user,
    loading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

// admin-e a user
export function useIsAdmin() {
  const { user } = useAuth();
  if (!user?.roles) return false;
  return user.roles.some((r) =>
    r.role_name.toLowerCase().includes("admin")
  );
}
