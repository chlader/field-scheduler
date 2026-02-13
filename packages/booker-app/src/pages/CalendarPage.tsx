import { useEffect, useState, useCallback } from 'react';
import { Typography, Box } from '@mui/material';
import dayjs from 'dayjs';
import type { WeekAvailabilityResponse } from '@field-scheduler/shared';
import { ApiClient } from '@field-scheduler/shared';
import WeekNavigator from '../components/WeekNavigator';
import WeekCalendar from '../components/WeekCalendar';
import BookingForm from '../components/BookingForm';
import type { BookingSlotContext } from '../components/BookingForm';

const api = new ApiClient('');

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [weekData, setWeekData] = useState<WeekAvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingSlot, setBookingSlot] = useState<BookingSlotContext | null>(null);

  const fetchWeek = useCallback((date: dayjs.Dayjs) => {
    setLoading(true);
    api.getWeekAvailability(date.format('YYYY-MM-DD'))
      .then(setWeekData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchWeek(currentDate);
  }, [currentDate, fetchWeek]);

  const handlePrevWeek = () => setCurrentDate((d) => d.subtract(7, 'day'));
  const handleNextWeek = () => setCurrentDate((d) => d.add(7, 'day'));
  const handleToday = () => setCurrentDate(dayjs());

  const handleBooked = () => {
    setBookingSlot(null);
    fetchWeek(currentDate);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Field Availability Calendar
      </Typography>
      <WeekNavigator
        weekStart={weekData?.weekStart || ''}
        weekEnd={weekData?.weekEnd || ''}
        onPrev={handlePrevWeek}
        onNext={handleNextWeek}
        onToday={handleToday}
      />
      <Box sx={{ mt: 2 }}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : weekData ? (
          <WeekCalendar data={weekData} onSlotClick={setBookingSlot} />
        ) : (
          <Typography>No data available.</Typography>
        )}
      </Box>
      <BookingForm
        slot={bookingSlot}
        onClose={() => setBookingSlot(null)}
        onBooked={handleBooked}
      />
    </>
  );
}
