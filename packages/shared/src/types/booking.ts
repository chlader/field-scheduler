export interface Booking {
  id: number;
  field_id: number;
  date: string;         // YYYY-MM-DD
  start_time: string;   // HH:MM
  end_time: string;     // HH:MM
  booker_name: string;
  booker_email?: string;
  purpose?: string;
  status: string;
  created_at: string;
}

export interface CreateBookingInput {
  field_id: number;
  date: string;
  start_time: string;
  end_time: string;
  booker_name: string;
  booker_email?: string;
  purpose?: string;
}
