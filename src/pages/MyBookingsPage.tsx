// src/pages/MyBookingsPage.tsx
import { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import SideBar from "../components/SideBar";
import { useAuth } from "../context/AuthContext";
import { listUserBookings, cancelBooking } from "../api/bookings";
import type { Booking } from "../types";
import { format } from "date-fns";

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listUserBookings(user.id);
        setBookings(data);
      } catch (e: any) {
        console.error(e);
        setError(
          e?.response?.data?.message ??
            "Nem sikerült betölteni a foglalásokat."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleCancel = async (booking: Booking) => {
    setMsg(null);
    setError(null);
    try {
      await cancelBooking(booking.booking_id);
      setMsg("Foglalás lemondva.");
      if (user) {
        const data = await listUserBookings(user.id);
        setBookings(data);
      }
    } catch (e: any) {
      console.error(e);
      setError(
        e?.response?.data?.message ??
          "Nem sikerült lemondani a foglalást."
      );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <TopNav />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-6 space-y-4 bg-slate-50">
          <h2 className="text-2xl font-semibold">Foglalásaim</h2>

          {msg && (
            <div className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded-md">
              {msg}
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          {loading && <div className="text-sm">Betöltés...</div>}

          {!loading && bookings.length === 0 && (
            <div className="text-sm text-slate-500">
              Még nincs foglalásod.
            </div>
          )}

          {!loading && bookings.length > 0 && (
            <div className="overflow-auto bg-white rounded-xl shadow">
              <table className="min-w-full text-sm">
                <thead className="border-b bg-slate-50">
                  <tr>
                    <th className="text-left px-3 py-2">Terem</th>
                    <th className="text-left px-3 py-2">Dátum</th>
                    <th className="text-left px-3 py-2">Idő</th>
                    <th className="text-left px-3 py-2">Státusz</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.booking_id} className="border-b">
                      <td className="px-3 py-2">
                        {b.room_name ?? "-"}
                      </td>
                      <td className="px-3 py-2">
                        {b.start_time
                          ? format(
                              new Date(b.start_time),
                              "yyyy.MM.dd."
                            )
                          : "-"}
                      </td>
                      <td className="px-3 py-2">
                        {b.start_time && b.end_time
                          ? `${format(
                              new Date(b.start_time),
                              "HH:mm"
                            )} – ${format(
                              new Date(b.end_time),
                              "HH:mm"
                            )}`
                          : "-"}
                      </td>
                      <td className="px-3 py-2">{b.status}</td>
                      <td className="px-3 py-2 text-right">
                        {b.status === "booked" && (
                          <button
                            onClick={() => handleCancel(b)}
                            className="px-3 py-1 rounded-md border text-xs hover:bg-slate-50"
                          >
                            Lemondás
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
