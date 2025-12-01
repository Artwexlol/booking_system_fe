// src/components/DashboardCalendar.tsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listUserBookings } from "../api/bookings";
import type { Booking } from "../types";

type CalendarCell = {
  date: Date;
  inCurrentMonth: boolean;
};

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function DashboardCalendar() {
  const { user } = useAuth();

  const userId =
    (user as any)?.id ?? (user as any)?.user_id ?? undefined;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ha még nincs user vagy userId, akkor ne kérjünk semmit az API-tól
    if (!userId) {
      setBookings([]);
      setError(null);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listUserBookings(userId);
        setBookings(data);
      } catch (err) {
        console.error("Foglalási naptár hiba:", err);
        setError("Nem sikerült betölteni a foglalásokat.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const weeks: CalendarCell[][] = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);

    // hétfő legyen az első nap
    const startWeekDay = (start.getDay() + 6) % 7;
    const firstCellDate = new Date(start);
    firstCellDate.setDate(start.getDate() - startWeekDay);

    const cells: CalendarCell[] = [];
    let current = firstCellDate;

    while (current <= end || cells.length % 7 !== 0) {
      cells.push({
        date: new Date(current),
        inCurrentMonth: current.getMonth() === currentMonth.getMonth(),
      });
      current = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate() + 1
      );
    }

    const rows: CalendarCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }
    return rows;
  }, [currentMonth]);

  const bookingsOnSelectedDay = useMemo(
    () =>
      bookings.filter((b) =>
        sameDay(new Date(b.start_time), selectedDate)
      ),
    [bookings, selectedDate]
  );

  const monthFormatter = new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "long",
  });

  const dayFormatter = new Intl.DateTimeFormat("hu-HU", {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const goPrevMonth = () =>
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  const goNextMonth = () =>
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );

  return (
    <div className="mt-10 flex justify-center">
      {/* ⬅ szélesebb kártya: max-w-6xl + w-full */}
      <div className="w-full max-w-6xl bg-white shadow rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Foglalási naptár
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={goPrevMonth}
              className="px-2 py-1 rounded-md border text-sm"
            >
              {"<"}
            </button>
            <span className="font-medium">
              {monthFormatter.format(currentMonth)}
            </span>
            <button
              onClick={goNextMonth}
              className="px-2 py-1 rounded-md border text-sm"
            >
              {">"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-7 text-center text-xs font-medium text-slate-500 mb-2">
          {["H", "K", "Sze", "Cs", "P", "Szo", "V"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-sm">
          {weeks.map((week, wi) =>
            week.map((cell, ci) => {
              const hasBooking = bookings.some((b) =>
                sameDay(new Date(b.start_time), cell.date)
              );
              const isSelected = sameDay(cell.date, selectedDate);

              return (
                <button
                  key={`${wi}-${ci}`}
                  disabled={!cell.inCurrentMonth}
                  onClick={() => setSelectedDate(cell.date)}
                  className={[
                    "aspect-square rounded-lg border text-center flex items-center justify-center",
                    cell.inCurrentMonth
                      ? "bg-slate-50 text-slate-800"
                      : "bg-slate-100 text-slate-300",
                    isSelected && "border-indigo-500 bg-indigo-50",
                    hasBooking && "font-semibold text-indigo-600",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {cell.date.getDate()}
                </button>
              );
            })
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-1">
            Foglalások ezen a napon
          </h3>

          {loading ? (
            <p className="text-sm text-slate-500">Betöltés…</p>
          ) : bookingsOnSelectedDay.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nincs foglalás ezen a napon.
            </p>
          ) : (
            <ul className="space-y-1 text-sm">
              {bookingsOnSelectedDay.map((b) => (
                <li
                  key={b.booking_id}
                  className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-1"
                >
                  <span className="font-medium">
                    {b.room_name ?? "Terem"}
                  </span>
                  <span className="text-slate-600">
                    {dayFormatter.format(new Date(b.start_time))} –{" "}
                    {new Intl.DateTimeFormat("hu-HU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(b.end_time))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
