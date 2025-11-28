// src/api/bookingLogs.ts
import { http } from "./http";
import type { BookingLog } from "../types";

export async function listBookingLogs() {
  const { data } = await http.get<BookingLog[]>("/booking-logs");
  return data;
}
