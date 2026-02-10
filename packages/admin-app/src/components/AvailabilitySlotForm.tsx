import { useState } from 'react';
import { TextField, Button, MenuItem, Paper, Box } from '@mui/material';
import { DAY_NAMES } from '@field-scheduler/shared';
import type { DayOfWeek, CreateAvailabilitySlotInput } from '@field-scheduler/shared';

interface Props {
  onSubmit: (input: CreateAvailabilitySlotInput) => void;
}

export default function AvailabilitySlotForm({ onSubmit }: Props) {
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ day_of_week: dayOfWeek, start_time: startTime, end_time: endTime });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Day of Week"
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(Number(e.target.value) as DayOfWeek)}
          select
        >
          {DAY_NAMES.map((name, i) => (
            <MenuItem key={i} value={i}>{name}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Start Time"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="End Time"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
        <Button type="submit" variant="contained">
          Add Slot
        </Button>
      </Box>
    </Paper>
  );
}
