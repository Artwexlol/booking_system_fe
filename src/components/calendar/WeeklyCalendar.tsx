import { addDays, format, startOfWeek } from "date-fns";
import type { Slot } from "../../types";

const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00-21:00

export default function WeeklyCalendar({
  weekStart,
  slots,
  onSelectSlot,
}: {
  weekStart: Date;
  slots: Slot[];
  onSelectSlot: (slot: Slot) => void;
}) {
  const start = startOfWeek(weekStart, { weekStartsOn: 1 }); // hétfő
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  function slotAt(day: Date, hour: number) {
    const dStr = format(day, "yyyy-MM-dd");
    return slots.filter(s => {
      const st = new Date(s.start);
      return format(st, "yyyy-MM-dd") === dStr && st.getHours() === hour;
    });
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-auto">
      <div className="grid grid-cols-8 min-w-[900px]">
        <div className="border-b p-2 text-sm text-gray-500">Idő</div>
        {days.map(d => (
          <div key={d.toISOString()} className="border-b p-2 text-sm font-medium">
            {format(d, "EEE dd.MM")}
          </div>
        ))}

        {hours.map(h => (
          <div key={h} className="contents">
            <div className="border-b border-r p-2 text-sm text-gray-500">
              {String(h).padStart(2, "0")}:00
            </div>
            {days.map(day => {
              const list = slotAt(day, h);
              return (
                <div key={day.toISOString() + h} className="border-b border-r p-1 h-20">
                  {list.length === 0 ? (
                    <div className="text-xs text-gray-300 p-2">—</div>
                  ) : (
                    list.map(slot => {
                      const full = slot.bookedCount >= slot.capacity;
                      return (
                        <button
                          key={slot.id}
                          onClick={() => onSelectSlot(slot)}
                          className={`w-full text-left rounded p-2 mb-1 text-xs border
                            ${full ? "bg-gray-100 text-gray-400" : "bg-green-50 text-green-800 hover:bg-green-100"}
                          `}
                        >
                          <div className="font-semibold">{slot.title ?? "Idősáv"}</div>
                          <div>
                            {format(new Date(slot.start), "HH:mm")}–{format(new Date(slot.end), "HH:mm")}
                          </div>
                          <div>
                            {slot.bookedCount}/{slot.capacity} fő
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
