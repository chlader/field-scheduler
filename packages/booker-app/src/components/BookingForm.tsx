import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
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
  const [bookerName, setBookerName] = useState('');
  const [bookerEmail, setBookerEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!slot) return null;

  const handleSubmit = async () => {
    if (!bookerName.trim()) {
      setError('Name is required');
      return;
    }

    setError('');
    setSubmitting(true);

    const input: CreateBookingInput = {
      field_id: slot.fieldId,
      date: slot.date,
      start_time: slot.startTime,
      end_time: slot.endTime,
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
          {slot.date} &middot; {slot.startTime} &ndash; {slot.endTime}
        </Alert>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          autoFocus
          label="Your Name"
          fullWidth
          required
          value={bookerName}
          onChange={(e) => setBookerName(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
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
