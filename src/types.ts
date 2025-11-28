// src/types.ts

export interface Role {
  role_id: number;
  role_name: string;
  role_desc?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles?: Role[];
}

export interface Room {
  room_id: number;
  name: string;
  capacity: number;
  created_at: string;
}

export interface Timeslot {
  timeslot_id: number;
  room_id: number;
  start_time: string;
  end_time: string;
  created_at?: string;
}

export interface Booking {
  booking_id: number;
  user_id: number;
  timeslot_id: number;
  status: string;
  created_at: string;
  start_time?: string;
  end_time?: string;
  room_name?: string;
}

export interface BookingLog {
  id: number;
  booking_id: number;
  operation: string;
  created_by: number;
  created_at: string;
}
