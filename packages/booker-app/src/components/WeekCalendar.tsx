import { Box, Typography, Paper, Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import type { WeekAvailabilityResponse, WeekBooking } from '@field-scheduler/shared';
import AvailabilityBlock from './AvailabilityBlock';
import type { BookingSlotContext } from './BookingForm';

interface Props {
  data: WeekAvailabilityResponse;
  onSlotClick?: (context: BookingSlotContext) => void;
}

const HOUR_START = 6;  // 6 AM
const HOUR_END = 22;   // 10 PM
const TOTAL_HOURS = HOUR_END - HOUR_START;

const SLOT_COLOR = '#2e7d32';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export default function WeekCalendar({ data, onSlotClick }: Props) {
  const weekStart = dayjs(data.weekStart);
  const days = Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day'));

  const activeFields = data.fields.filter((f) => f.slots.length > 0);

  const hourLabels = Array.from({ length: TOTAL_HOURS }, (_, i) => {
    const hour = HOUR_START + i;
    const suffix = hour < 12 ? 'AM' : 'PM';
    const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${display} ${suffix}`;
  });

  return (
    <Paper sx={{ overflow: 'auto', border: '1px solid #ddd' }} elevation={0}>
      <Box sx={{ display: 'flex', minWidth: 800 }}>
        {/* Time labels column */}
        <Box sx={{ width: 60, flexShrink: 0 }}>
          <Box sx={{ height: 40, borderBottom: '1px solid #ddd' }} />
          {hourLabels.map((label, i) => (
            <Box
              key={i}
              sx={{
                height: 60,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                pr: 1,
                mt: i === 0 ? 0 : '-16px',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Day columns */}
        {days.map((day, dayIndex) => {
          const dateStr = day.format('YYYY-MM-DD');

          return (
            <Box
              key={dayIndex}
              sx={{
                flex: 1,
                minWidth: 100,
                borderLeft: '1px solid #ddd',
              }}
            >
              {/* Day header */}
              <Box
                sx={{
                  height: 40,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: '1px solid #ddd',
                }}
              >
                <Typography variant="caption">
                  {DAY_LABELS[dayIndex]}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {day.format('M/D')}
                </Typography>
              </Box>

              {/* Time grid */}
              <Box sx={{ position: 'relative', height: TOTAL_HOURS * 60, overflow: 'hidden' }}>
                {/* Hour lines */}
                {hourLabels.map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: 'absolute',
                      top: i * 60,
                      left: 0,
                      right: 0,
                      borderTop: '1px solid #eee',
                    }}
                  />
                ))}

                {/* Availability blocks */}
                {activeFields.map((field) => {
                  const daySlots = field.slots.filter((s) => s.date === dateStr);
                  return daySlots.map((slot, slotIdx) => {
                    const startMin = timeToMinutes(slot.startTime) - HOUR_START * 60;
                    const endMin = timeToMinutes(slot.endTime) - HOUR_START * 60;
                    const topPercent = (startMin / (TOTAL_HOURS * 60)) * 100;
                    const heightPercent = ((endMin - startMin) / (TOTAL_HOURS * 60)) * 100;

                    return (
                      <AvailabilityBlock
                        key={`${field.fieldId}-${slotIdx}`}
                        fieldName={field.fieldName}
                        startTime={slot.startTime}
                        endTime={slot.endTime}
                        color={SLOT_COLOR}
                        topPercent={topPercent}
                        heightPercent={heightPercent}
                        leftPercent={0}
                        widthPercent={100}
                        onClick={onSlotClick ? () => onSlotClick({
                          fieldId: field.fieldId,
                          fieldName: field.fieldName,
                          date: slot.date,
                          startTime: slot.startTime,
                          endTime: slot.endTime,
                        }) : undefined}
                      />
                    );
                  });
                })}

                {/* Booking overlays */}
                {(data.bookings || [])
                  .filter((b: WeekBooking) => b.date === dateStr)
                  .map((booking: WeekBooking) => {
                    const startMin = timeToMinutes(booking.startTime) - HOUR_START * 60;
                    const endMin = timeToMinutes(booking.endTime) - HOUR_START * 60;
                    const topPercent = (startMin / (TOTAL_HOURS * 60)) * 100;
                    const heightPercent = ((endMin - startMin) / (TOTAL_HOURS * 60)) * 100;

                    return (
                      <Tooltip
                        key={`booking-${booking.id}`}
                        title={`Booked by ${booking.bookerName}${booking.purpose ? ` — ${booking.purpose}` : ''}`}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: `${topPercent}%`,
                            height: `${heightPercent}%`,
                            left: 0,
                            width: '100%',
                            bgcolor: 'rgba(0,0,0,0.55)',
                            borderRadius: 1,
                            px: 0.5,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            zIndex: 1,
                          }}
                        >
                          <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, lineHeight: 1.2 }}>
                            Booked
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.6rem' }}>
                            {booking.bookerName}
                          </Typography>
                        </Box>
                      </Tooltip>
                    );
                  })}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
