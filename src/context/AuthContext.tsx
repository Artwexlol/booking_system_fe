// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { User, Role } from "../types";
import { loginApi, meApi } from "../api/auth";
import { http } from "../api/http";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  const login = async (email: string, password: string) => {
    const { token, user } = await loginApi(email, password);

    localStorage.setItem("token", token);

    // lekérjük a role-okat
    let roles: Role[] = [];
    try {
      const { data } = await http.get<Role[]>(`/users/${user.id}/roles`);
      roles = data;
    } catch (err) {
      console.warn("Nem sikerült role-okat betölteni", err);
    }

    setUser({ ...user, roles });
  };

  const logout = async () => {
    const token = localStorage.getItem("token");
    localStorage.removeItem("token");
    setUser(null);

    if (token) {
      try {
        await http.post("/auth/logout", {});
      } catch (_e) {
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
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
