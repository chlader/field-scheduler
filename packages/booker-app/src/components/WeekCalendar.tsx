import { Box, Typography, Paper } from '@mui/material';
import dayjs from 'dayjs';
import type { WeekAvailabilityResponse } from '@field-scheduler/shared';
import AvailabilityBlock from './AvailabilityBlock';

interface Props {
  data: WeekAvailabilityResponse;
}

const HOUR_START = 6;  // 6 AM
const HOUR_END = 22;   // 10 PM
const TOTAL_HOURS = HOUR_END - HOUR_START;

const FIELD_COLORS = [
  '#2e7d32', '#1565c0', '#c62828', '#6a1b9a',
  '#e65100', '#00838f', '#4e342e', '#37474f',
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export default function WeekCalendar({ data }: Props) {
  const weekStart = dayjs(data.weekStart);
  const days = Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day'));

  // Fields that actually have slots
  const activeFields = data.fields.filter((f) => f.slots.length > 0);
  const fieldCount = activeFields.length || 1;

  const hourLabels = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => {
    const hour = HOUR_START + i;
    const suffix = hour < 12 ? 'AM' : 'PM';
    const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${display} ${suffix}`;
  });

  return (
    <Paper sx={{ overflow: 'auto' }}>
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
                mt: '-8px',
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
          const isToday = day.isSame(dayjs(), 'day');

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
                  bgcolor: isToday ? 'primary.light' : 'transparent',
                }}
              >
                <Typography variant="caption" fontWeight={isToday ? 700 : 400}>
                  {DAY_LABELS[dayIndex]}
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={isToday ? 700 : 400}
                  color={isToday ? 'primary.contrastText' : 'text.secondary'}
                >
                  {day.format('M/D')}
                </Typography>
              </Box>

              {/* Time grid */}
              <Box sx={{ position: 'relative', height: TOTAL_HOURS * 60 }}>
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
                {activeFields.map((field, fieldIdx) => {
                  const daySlots = field.slots.filter((s) => s.date === dateStr);
                  return daySlots.map((slot, slotIdx) => {
                    const startMin = timeToMinutes(slot.startTime) - HOUR_START * 60;
                    const endMin = timeToMinutes(slot.endTime) - HOUR_START * 60;
                    const topPercent = (startMin / (TOTAL_HOURS * 60)) * 100;
                    const heightPercent = ((endMin - startMin) / (TOTAL_HOURS * 60)) * 100;
                    const widthPercent = 100 / fieldCount;
                    const leftPercent = fieldIdx * widthPercent;

                    return (
                      <AvailabilityBlock
                        key={`${field.fieldId}-${slotIdx}`}
                        fieldName={field.fieldName}
                        startTime={slot.startTime}
                        endTime={slot.endTime}
                        color={FIELD_COLORS[fieldIdx % FIELD_COLORS.length]}
                        topPercent={topPercent}
                        heightPercent={heightPercent}
                        leftPercent={leftPercent}
                        widthPercent={widthPercent}
                      />
                    );
                  });
                })}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Legend */}
      {activeFields.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2, p: 2, borderTop: '1px solid #ddd', flexWrap: 'wrap' }}>
          {activeFields.map((field, i) => (
            <Box key={field.fieldId} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: FIELD_COLORS[i % FIELD_COLORS.length], borderRadius: '2px' }} />
              <Typography variant="caption">{field.fieldName}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
