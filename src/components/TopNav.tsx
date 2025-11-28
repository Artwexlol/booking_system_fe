// src/components/TopNav.tsx
import { useAuth } from "../context/AuthContext";

export default function TopNav() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 px-6 flex items-center justify-between bg-white border-b">
      <div className="font-semibold text-lg">Foglalási rendszer</div>
      <div className="flex items-center gap-4 text-sm">
        {user && (
          <span className="text-slate-600">
            Bejelentkezve:{" "}
            <span className="font-medium">{user.name}</span>
          </span>
        )}
        <button
          onClick={() => logout()}
          className="px-3 py-1 rounded-md border text-sm hover:bg-slate-50"
        >
          Kilépés
        </button>
      </div>
    </header>
  );
}
