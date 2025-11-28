// src/api/rooms.ts
import { http } from "./http";
import type { Room, Timeslot } from "../types";

export async function listRooms() {
  const { data } = await http.get<Room[]>("/rooms");
  return data;
}

export async function getRoomTimeslots(roomId: number) {
  const { data } = await http.get<Timeslot[]>(`/rooms/${roomId}/timeslots`);
  return data;
}

export async function getRoomAvailableTimeslots(roomId: number) {
  const { data } = await http.get<Timeslot[]>(
    `/rooms/${roomId}/available-timeslots`
  );
  return data;
}
