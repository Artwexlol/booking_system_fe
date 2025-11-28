import TopNav from "../components/TopNav";
import SideBar from "../components/SideBar";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="h-full flex flex-col">
      <TopNav />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-6 bg-gray-50">
          <h2 className="text-2xl font-semibold mb-2">
            Szia, {user?.name} 👋
          </h2>
          <p className="text-gray-700 mb-6">
            Itt lehet kezelni az órarendet, illetve termeket.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/calendar" className="bg-white p-5 rounded-xl shadow hover:shadow-md">
              <h3 className="font-semibold text-lg">Naptár / Foglalás</h3>
              <p className="text-sm text-gray-600">Szabad helyek megtekintése és foglalás.</p>
            </Link>

            {user?.role === "ADMIN" && (
              <Link to="/admin" className="bg-white p-5 rounded-xl shadow hover:shadow-md">
                <h3 className="font-semibold text-lg">Admin felület</h3>
                <p className="text-sm text-gray-600">Órák, termek, kapacitás kezelése.</p>
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}