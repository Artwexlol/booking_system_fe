import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();      
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(name, email, password);
      navigate("/");
    } catch (err: any) {
      console.error("Register error:", err);
      if (err.response?.status === 409) {
        setError("Ezzel az email címmel már létezik felhasználó.");
      } else {
        setError("Sikertelen regisztráció. Próbáld újra később.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">Regisztráció</h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-sm">
            <label className="block font-medium">Név</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            className="w-full mt-2 bg-slate-900 text-white py-2 rounded-md text-sm font-medium hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Fiók létrehozása..." : "Fiók létrehozása"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Már van fiókod?{" "}
          <Link to="/login" className="text-sky-600 hover:underline">
            Bejelentkezés
          </Link>
        </p>
      </div>
    </div>
  );
}
