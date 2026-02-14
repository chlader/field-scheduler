import { useEffect, useState, useCallback } from 'react';
import { Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import dayjs from 'dayjs';
import type { Field, WeekAvailabilityResponse } from '@field-scheduler/shared';
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
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<number | ''>('');

  useEffect(() => {
    api.getFields().then((fetched) => {
      setFields(fetched);
      if (fetched.length > 0 && selectedFieldId === '') {
        setSelectedFieldId(fetched[0].id);
      }
    }).catch(console.error);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
  const handleFieldChange = (e: SelectChangeEvent<number>) => {
    setSelectedFieldId(Number(e.target.value));
  };

  const handleBooked = () => {
    setBookingSlot(null);
    fetchWeek(currentDate);
  };

  const filteredWeekData: WeekAvailabilityResponse | null = weekData && selectedFieldId !== ''
    ? {
        ...weekData,
        fields: weekData.fields.filter((f) => f.fieldId === selectedFieldId),
        bookings: (weekData.bookings || []).filter((b) => b.fieldId === selectedFieldId),
      }
    : weekData;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Field Availability Calendar
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <WeekNavigator
          weekStart={weekData?.weekStart || ''}
          weekEnd={weekData?.weekEnd || ''}
          onPrev={handlePrevWeek}
          onNext={handleNextWeek}
        />
        {fields.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 250 }}>
            <InputLabel>Field</InputLabel>
            <Select
              value={selectedFieldId === '' ? '' as unknown as number : selectedFieldId}
              label="Field"
              onChange={handleFieldChange}
            >
              {fields.map((f) => (
                <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
      <Box sx={{ mt: 2 }}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : filteredWeekData ? (
          <WeekCalendar data={filteredWeekData} onSlotClick={setBookingSlot} />
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
