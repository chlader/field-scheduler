import { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import dayjs from 'dayjs';
import type { WeekAvailabilityResponse } from '@field-scheduler/shared';
import { ApiClient } from '@field-scheduler/shared';
import WeekNavigator from '../components/WeekNavigator';
import WeekCalendar from '../components/WeekCalendar';

const api = new ApiClient('');

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [weekData, setWeekData] = useState<WeekAvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getWeekAvailability(currentDate.format('YYYY-MM-DD'))
      .then(setWeekData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentDate]);

  const handlePrevWeek = () => setCurrentDate((d) => d.subtract(7, 'day'));
  const handleNextWeek = () => setCurrentDate((d) => d.add(7, 'day'));
  const handleToday = () => setCurrentDate(dayjs());

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
          <WeekCalendar data={weekData} />
        ) : (
          <Typography>No data available.</Typography>
        )}
      </Box>
    </>
  );
}
