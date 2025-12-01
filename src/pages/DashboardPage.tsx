// src/pages/DashboardPage.tsx
import TopNav from "../components/TopNav";
import SideBar from "../components/SideBar";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import DashboardCalendar from "../components/DashboardCalendar";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="h-full flex flex-col">
      <TopNav />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-6 space-y-4 bg-slate-50">
          <h2 className="text-2xl font-semibold mb-2">
            Üdv, {user?.name ?? "Felhasználó"}!
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Link
              to="/calendar"
              className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold mb-1">Új foglalás</h3>
              <p className="text-sm text-slate-600">
                Válassz termet és szabad időpontot a naptárban.
              </p>
            </Link>

            <Link
              to="/bookings"
              className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold mb-1">Foglalásaim</h3>
              <p className="text-sm text-slate-600">
                Nézd meg a meglévő foglalásaidat, és szükség esetén
                mondd le őket.
              </p>
            </Link>
          </div>
          <DashboardCalendar/>
        </main>
      </div>
    </div>
  );
}
