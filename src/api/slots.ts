import { http } from "./http";
import type { Slot } from "../types";

export async function listSlots(resourceId: string, from: string, to: string) {
  const { data } = await http.get<Slot[]>("/slots", {
    params: { resourceId, from, to },
  });
  return data;
}
