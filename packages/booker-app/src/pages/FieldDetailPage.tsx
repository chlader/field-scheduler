import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Typography, Paper, Chip, Box, Button, TextField, Divider, Alert, Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { Field, AvailabilitySlot, Booking, CreateBookingInput } from '@field-scheduler/shared';
import { ApiClient, DAY_NAMES } from '@field-scheduler/shared';

const api = new ApiClient('');

function formatTime(t: string): string {
  const [hStr, mStr] = t.split(':');
  const h = Number(hStr);
  const suffix = h < 12 ? 'AM' : 'PM';
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:${mStr} ${suffix}`;
}

function getTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FieldDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [field, setField] = useState<Field | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedDate, setSelectedDate] = useState(getTomorrow);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('20:00');
  const [bookerName, setBookerName] = useState('');
  const [bookerEmail, setBookerEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (id) {
      Promise.all([
        api.getField(Number(id)),
        api.getAvailability(Number(id)),
      ]).then(([f, s]) => {
        setField(f);
        setSlots(s);
      }).catch(console.error);
    }
  }, [id]);

  const fetchBookings = useCallback((fieldId: number, date: string) => {
    api.getFieldBookings(fieldId, { date }).then(setBookings).catch(console.error);
  }, []);

  useEffect(() => {
    if (id && selectedDate) {
      fetchBookings(Number(id), selectedDate);
    }
  }, [id, selectedDate, fetchBookings]);

  const handleSubmit = async () => {
    if (!field) return;

    setError('');
    setSuccess('');

    if (!selectedDate) {
      setError('Date is required');
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
    if (!bookerName.trim()) {
      setError('Name is required');
      return;
    }
    if (bookerEmail.trim() && !EMAIL_RE.test(bookerEmail.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    setSubmitting(true);

    const input: CreateBookingInput = {
      field_id: field.id,
      date: selectedDate,
      start_time: startTime,
      end_time: endTime,
      booker_name: bookerName.trim(),
      ...(bookerEmail.trim() ? { booker_email: bookerEmail.trim() } : {}),
      ...(purpose.trim() ? { purpose: purpose.trim() } : {}),
    };

    try {
      await api.createBooking(input);
      setSuccess('Booking confirmed!');
      setStartTime('08:00');
      setEndTime('20:00');
      setBookerName('');
      setBookerEmail('');
      setPurpose('');
      fetchBookings(field.id, selectedDate);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (!field) return <Typography>Loading...</Typography>;

  const selectedDayOfWeek = selectedDate ? new Date(selectedDate + 'T00:00:00').getDay() : -1;
  const daySlots = slots.filter((s) => s.day_of_week === selectedDayOfWeek);

  return (
    <>
      <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Fields
      </Button>
      <Paper sx={{ p: 3 }}>
        {field.photo_url && (
          <Box
            component="img"
            src={field.photo_url}
            alt=""
            sx={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 1, mb: 2 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        <Typography variant="h4" gutterBottom>{field.name}</Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={field.field_type} color="primary" />
          {field.surface && <Chip label={field.surface} variant="outlined" />}
          {field.size && <Chip label={field.size} variant="outlined" />}
          {field.has_lights && <Chip label="Lights" size="small" />}
          {field.has_parking && <Chip label="Parking" size="small" />}
          {field.is_indoor && <Chip label="Indoor" size="small" />}
        </Box>
        {field.location && (
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {field.location}
          </Typography>
        )}
        {field.description && (
          <Typography variant="body1" gutterBottom>
            {field.description}
          </Typography>
        )}

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Typography variant="h6" gutterBottom>Book This Field</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                type="date"
                label="Date"
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); setSuccess(''); setError(''); }}
                InputLabelProps={{ shrink: true }}
              />

              {selectedDate && daySlots.length === 0 && (
                <Alert severity="warning">
                  No availability on {DAY_NAMES[selectedDayOfWeek]}s.
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  type="time"
                  label="Start time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                  fullWidth
                />
                <TextField
                  type="time"
                  label="End time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                  fullWidth
                />
              </Box>
              <TextField
                label="Your Name"
                required
                value={bookerName}
                onChange={(e) => setBookerName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={bookerEmail}
                onChange={(e) => setBookerEmail(e.target.value)}
                fullWidth
              />
              <TextField
                label="Purpose"
                multiline
                rows={2}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                fullWidth
              />
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Booking...' : 'Book'}
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Typography variant="h6" gutterBottom>Existing Bookings</Typography>
            {bookings.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {bookings.map((b) => (
                  <Paper key={b.id} variant="outlined" sx={{ p: 1.5 }}>
                    <Typography variant="body2">
                      {formatTime(b.start_time)} &ndash; {formatTime(b.end_time)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {b.booker_name}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No bookings on this date.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
