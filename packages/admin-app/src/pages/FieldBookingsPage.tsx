import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Typography, Box, Button, Paper, IconButton, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle,
  DialogContent, DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CancelIcon from '@mui/icons-material/Cancel';
import dayjs from 'dayjs';
import type { Field, Booking } from '@field-scheduler/shared';
import { ApiClient } from '@field-scheduler/shared';

const api = new ApiClient('');

function formatTime(t: string): string {
  const [hStr, mStr] = t.split(':');
  const h = Number(hStr);
  const suffix = h < 12 ? 'AM' : 'PM';
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:${mStr} ${suffix}`;
}

function getWeekDates(date: dayjs.Dayjs): dayjs.Dayjs[] {
  const start = date.startOf('week');
  return Array.from({ length: 7 }, (_, i) => start.add(i, 'day'));
}

export default function FieldBookingsPage() {
  const { id } = useParams<{ id: string }>();
  const fieldId = Number(id);
  const [field, setField] = useState<Field | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    api.getField(fieldId).then(setField).catch(console.error);
  }, [fieldId]);

  const weekDates = getWeekDates(currentDate);

  const fetchBookings = useCallback(() => {
    const promises = weekDates.map((d) =>
      api.getFieldBookings(fieldId, { date: d.format('YYYY-MM-DD') })
    );
    Promise.all(promises)
      .then((results) => setBookings(results.flat()))
      .catch(console.error);
  }, [fieldId, weekDates[0].format('YYYY-MM-DD')]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await api.cancelBooking(cancelTarget.id);
      setCancelTarget(null);
      fetchBookings();
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    } finally {
      setCancelling(false);
    }
  };

  const weekStart = weekDates[0].format('MMM D');
  const weekEnd = weekDates[6].format('MMM D, YYYY');

  if (!field) return <Typography>Loading...</Typography>;

  return (
    <>
      <Button component={Link} to="/fields" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Fields
      </Button>
      <Typography variant="h4" gutterBottom>
        Bookings: {field.name}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconButton onClick={() => setCurrentDate((d) => d.subtract(7, 'day'))}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6">
          {weekStart} &ndash; {weekEnd}
        </Typography>
        <IconButton onClick={() => setCurrentDate((d) => d.add(7, 'day'))}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {weekDates.map((day) => {
        const dateStr = day.format('YYYY-MM-DD');
        const dayBookings = bookings
          .filter((b) => b.date === dateStr && b.status === 'confirmed')
          .sort((a, b) => a.start_time.localeCompare(b.start_time));
        const isToday = day.isSame(dayjs(), 'day');

        return (
          <Paper
            key={dateStr}
            variant="outlined"
            sx={{ mb: 1, p: 2, bgcolor: isToday ? 'action.hover' : undefined }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {day.format('dddd, MMM D')}
              {isToday && (
                <Chip label="Today" size="small" color="primary" sx={{ ml: 1 }} />
              )}
            </Typography>
            {dayBookings.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                No bookings
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small" sx={{ mt: 0.5 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Time</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Purpose</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dayBookings.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {formatTime(b.start_time)} &ndash; {formatTime(b.end_time)}
                        </TableCell>
                        <TableCell>{b.booker_name}</TableCell>
                        <TableCell>{b.booker_email || '—'}</TableCell>
                        <TableCell>{b.purpose || '—'}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setCancelTarget(b)}
                            title="Cancel booking"
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        );
      })}

      <Dialog open={cancelTarget !== null} onClose={() => setCancelTarget(null)}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          {cancelTarget && (
            <Typography>
              Cancel booking for <strong>{cancelTarget.booker_name}</strong> on{' '}
              {cancelTarget.date} ({formatTime(cancelTarget.start_time)} &ndash;{' '}
              {formatTime(cancelTarget.end_time)})?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelTarget(null)} disabled={cancelling}>
            Keep
          </Button>
          <Button onClick={handleCancel} color="error" variant="contained" disabled={cancelling}>
            {cancelling ? 'Cancelling...' : 'Cancel Booking'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
