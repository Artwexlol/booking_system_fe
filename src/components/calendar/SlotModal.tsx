import { format } from "date-fns";
import type { Slot } from "../../types";

export default function SlotModal({
  slot,
  onClose,
  onBook,
}: {
  slot: Slot;
  onClose: () => void;
  onBook: (slotId: string) => void;
}) {
  const full = slot.bookedCount >= slot.capacity;

  return (
    <div className="fixed inset-0 bg-black/30 grid place-items-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow p-5">
        <h3 className="text-lg font-semibold mb-2">{slot.title ?? "Idősáv"}</h3>
        <div className="text-sm text-gray-700 space-y-1 mb-4">
          <div>Idő: {format(new Date(slot.start), "yyyy.MM.dd HH:mm")} – {format(new Date(slot.end), "HH:mm")}</div>
          {slot.trainerName && <div>Oktató/Edző: {slot.trainerName}</div>}
          <div>Kapacitás: {slot.bookedCount}/{slot.capacity}</div>
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-2 rounded border">
            Mégse
          </button>
          <button
            disabled={full}
            onClick={() => onBook(slot.id)}
            className="px-3 py-2 rounded bg-gray-900 text-white disabled:opacity-50"
          >
            Foglalás
          </button>
        </div>
      </div>
    </div>
  );
}
