// src/api/bookings.ts
import { http } from "./http";
import type { Booking } from "../types";

export async function createBooking(userId: number, timeslotId: number) {
  const { data } = await http.post<Booking[]>("/bookings", {
    user_id: userId,
    timeslot_id: timeslotId,
  });
  return data[0];
}

export async function listUserBookings(userId: number) {
  const { data } = await http.get<Booking[]>(`/users/${userId}/bookings`);
  return data;
}

export async function cancelBooking(bookingId: number) {
  const { data } = await http.post<{ message: string }>(
    `/bookings/${bookingId}/cancel`,
    {}
  );
  return data;
}

export async function listAllBookings() {
  const { data } = await http.get<Booking[]>("/bookings");
  return data;
}
