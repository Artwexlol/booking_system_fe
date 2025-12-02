// src/pages/CalendarPage.tsx
import { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import SideBar from "../components/SideBar";
import { useAuth } from "../context/AuthContext";
import { listRooms, getRoomAvailableTimeslots } from "../api/rooms";
import { createBooking } from "../api/bookings";
import type { Room, Timeslot } from "../types";
import { format } from "date-fns";

export default function CalendarPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await listRooms();
        setRooms(data);
        if (data.length > 0) {
          setSelectedRoomId(data[0].room_id);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedRoomId) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRoomAvailableTimeslots(selectedRoomId);
        setTimeslots(data);
      } catch (e: any) {
        console.error(e);
        setError(
          e?.response?.data?.message ??
            "Nem sikerült betölteni az időpontokat."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedRoomId]);

  const handleBook = async (slot: Timeslot) => {
    if (!user) return;
    setMsg(null);
    setError(null);
    try {
      await createBooking(user.id, slot.timeslot_id);
      setMsg("Sikeres foglalás!");
      // szabad időpont frissítés
      if (selectedRoomId) {
        const data = await getRoomAvailableTimeslots(selectedRoomId);
        setTimeslots(data);
      }
    } catch (e: any) {
      console.error(e);
      setError(
        e?.response?.data?.message ??
          "Nem sikerült létrehozni a foglalást."
      );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <TopNav />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-6 space-y-4 bg-slate-50">
          <h2 className="text-2xl font-semibold mb-2">Foglalás</h2>

          <div className="flex gap-4">
            <div className="w-56 bg-white rounded-xl shadow p-3">
              <h3 className="text-sm font-semibold mb-2">Termek</h3>
              <div className="space-y-1 text-sm">
                {rooms.map((room) => (
                  <button
                    key={room.room_id}
                    onClick={() => setSelectedRoomId(room.room_id)}
                    className={`w-full text-left px-2 py-1 rounded-md ${
                      selectedRoomId === room.room_id
                        ? "bg-slate-900 text-white"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    {room.name}{" "}
                    <span className="text-xs text-slate-400">
                      (kap.: {room.capacity})
                    </span>
                  </button>
                ))}
                {rooms.length === 0 && (
                  <div className="text-xs text-slate-500">
                    Nincs még egyetlen terem sem.
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 bg-white rounded-xl shadow p-4 space-y-3">
              <h3 className="text-sm font-semibold mb-2">
                Szabad időpontok
              </h3>

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

              {!loading && timeslots.length === 0 && (
                <div className="text-sm text-slate-500">
                  Nincs elérhető szabad időpont a kiválasztott teremben.
                </div>
              )}

              <div className="space-y-2">
                {timeslots.map((slot) => (
                  <div
                    key={slot.timeslot_id}
                    className="flex items-center justify-between border rounded-md px-3 py-2 text-sm"
                  >
                    <div>
                      <div className="font-medium">
                        {format(new Date(slot.start_time), "yyyy.MM.dd.")}
                      </div>
                      <div className="text-slate-600">
                        {format(new Date(slot.start_time), "HH:mm")} –{" "}
                        {format(new Date(slot.end_time), "HH:mm")}
                      </div>
                    </div>
                    <button
                      onClick={() => handleBook(slot)}
                      className="px-3 py-1 rounded-md text-sm bg-slate-900 text-white hover:bg-slate-800"
                    >
                      Foglalás
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
