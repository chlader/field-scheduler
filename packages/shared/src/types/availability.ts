export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sunday, 6=Saturday

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export interface AvailabilitySlot {
  id: number;
  field_id: number;
  day_of_week: DayOfWeek;
  start_time: string; // HH:mm format
  end_time: string;   // HH:mm format
  created_at: string;
}

export interface CreateAvailabilitySlotInput {
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
}

export interface ResolvedSlot {
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm
  endTime: string;    // HH:mm
}

export interface FieldWeekAvailability {
  fieldId: number;
  fieldName: string;
  slots: ResolvedSlot[];
}

export interface WeekAvailabilityResponse {
  weekStart: string;  // YYYY-MM-DD (Sunday)
  weekEnd: string;    // YYYY-MM-DD (Saturday)
  fields: FieldWeekAvailability[];
}
