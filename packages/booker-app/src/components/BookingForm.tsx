import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import type { CreateBookingInput } from '@field-scheduler/shared';
import { ApiClient } from '@field-scheduler/shared';

const api = new ApiClient('');

interface BookingSlotContext {
  fieldId: number;
  fieldName: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface Props {
  slot: BookingSlotContext | null;
  onClose: () => void;
  onBooked: () => void;
}

export type { BookingSlotContext };

export default function BookingForm({ slot, onClose, onBooked }: Props) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [bookerName, setBookerName] = useState('');
  const [bookerEmail, setBookerEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (slot) {
      setStartTime(slot.startTime);
      setEndTime(slot.endTime);
      setError('');
    }
  }, [slot]);

  if (!slot) return null;

  const handleSubmit = async () => {
    if (!bookerName.trim()) {
      setError('Name is required');
      return;
    }
    if (!startTime || !endTime) {
      setError('Start and end times are required');
      return;
    }
    if (startTime >= endTime) {
      setError('Start time must be before end time');
      return;
    }
    if (startTime < slot.startTime || endTime > slot.endTime) {
      setError(`Times must be within the available window (${slot.startTime} – ${slot.endTime})`);
      return;
    }

    setError('');
    setSubmitting(true);

    const input: CreateBookingInput = {
      field_id: slot.fieldId,
      date: slot.date,
      start_time: startTime,
      end_time: endTime,
      booker_name: bookerName.trim(),
      ...(bookerEmail.trim() ? { booker_email: bookerEmail.trim() } : {}),
      ...(purpose.trim() ? { purpose: purpose.trim() } : {}),
    };

    try {
      await api.createBooking(input);
      setBookerName('');
      setBookerEmail('');
      setPurpose('');
      onBooked();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Book {slot.fieldName}</DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          {slot.date} &middot; Available {slot.startTime} &ndash; {slot.endTime}
        </Alert>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography variant="subtitle2" sx={{ mb: 1, mt: 1 }}>Booking Time</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            type="time"
            label="Start"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: slot.startTime, max: slot.endTime, step: 300 }}
            fullWidth
          />
          <TextField
            type="time"
            label="End"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: slot.startTime, max: slot.endTime, step: 300 }}
            fullWidth
          />
        </Box>
        <TextField
          autoFocus
          label="Your Name"
          fullWidth
          required
          value={bookerName}
          onChange={(e) => setBookerName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={bookerEmail}
          onChange={(e) => setBookerEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Purpose"
          fullWidth
          multiline
          rows={2}
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {submitting ? 'Booking...' : 'Book'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
