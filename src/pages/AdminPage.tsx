// src/pages/AdminPage.tsx
import { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import SideBar from "../components/SideBar";
import { useAuth, useIsAdmin } from "../context/AuthContext";
import { listBookingLogs } from "../api/bookingLogs";
import { listRooms } from "../api/rooms";
import type { BookingLog, Room } from "../types";
import { format } from "date-fns";

export default function AdminPage() {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();

  const [logs, setLogs] = useState<BookingLog[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const [logData, roomData] = await Promise.all([
          listBookingLogs(),
          listRooms(),
        ]);
        setLogs(logData);
        setRooms(roomData);
      } catch (e: any) {
        console.error(e);
        setError(
          e?.response?.data?.message ??
            "Nem sikerült betölteni az admin adatokat."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="h-full flex flex-col">
        <TopNav />
        <div className="flex flex-1">
          <SideBar />
          <main className="flex-1 p-6 bg-slate-50">
            Nincs jogosultságod az admin felülethez.
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <TopNav />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-6 space-y-4 bg-slate-50">
          <h2 className="text-2xl font-semibold mb-2">
            Admin felület
          </h2>

          {loading && <div>Betöltés...</div>}
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <section className="bg-white rounded-xl shadow p-4 space-y-2">
                <h3 className="text-lg font-semibold">
                  Termek listája
                </h3>
                <div className="text-sm">
                  {rooms.length === 0 && (
                    <div className="text-slate-500">
                      Nincs még egyetlen terem sem.
                    </div>
                  )}
                  {rooms.length > 0 && (
                    <ul className="space-y-1">
                      {rooms.map((r) => (
                        <li
                          key={r.room_id}
                          className="flex justify-between border-b last:border-b-0 py-1"
                        >
                          <span>{r.name}</span>
                          <span className="text-slate-500 text-xs">
                            kapacitás: {r.capacity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>

              <section className="bg-white rounded-xl shadow p-4 space-y-2">
                <h3 className="text-lg font-semibold">
                  Foglalási napló
                </h3>
                <div className="overflow-auto text-sm">
                  {logs.length === 0 && (
                    <div className="text-slate-500">
                      Még nincs naplóbejegyzés.
                    </div>
                  )}
                  {logs.length > 0 && (
                    <table className="min-w-full text-sm">
                      <thead className="border-b bg-slate-50">
                        <tr>
                          <th className="text-left px-3 py-2">ID</th>
                          <th className="text-left px-3 py-2">
                            Booking ID
                          </th>
                          <th className="text-left px-3 py-2">
                            Művelet
                          </th>
                          <th className="text-left px-3 py-2">
                            User ID
                          </th>
                          <th className="text-left px-3 py-2">Dátum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((l) => (
                          <tr key={l.id} className="border-b">
                            <td className="px-3 py-1">{l.id}</td>
                            <td className="px-3 py-1">
                              {l.booking_id}
                            </td>
                            <td className="px-3 py-1">
                              {l.operation}
                            </td>
                            <td className="px-3 py-1">
                              {l.created_by}
                            </td>
                            <td className="px-3 py-1">
                              {format(
                                new Date(l.created_at),
                                "yyyy.MM.dd. HH:mm"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
