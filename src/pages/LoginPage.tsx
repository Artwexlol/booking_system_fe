import { FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error(error);
      const msg =
        error?.response?.data?.message ?? "Sikertelen bejelentkezés";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 space-y-4">
        <h1 className="text-xl font-semibold">Bejelentkezés</h1>

        {err && (
          <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-md">
            {err}
          </div>
        )}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1 text-sm">
            <label className="block font-medium">Email</label>
            <input
              type="email"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1 text-sm">
            <label className="block font-medium">Jelszó</label>
            <input
              type="password"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-slate-900 text-white py-2 rounded-md text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Belépés..." : "Belépés"}
          </button>
        </form>
      </div>
    </div>
  );
}
