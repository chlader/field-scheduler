import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Paper, Chip, Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { Field, AvailabilitySlot } from '@field-scheduler/shared';
import { ApiClient, DAY_NAMES } from '@field-scheduler/shared';

const api = new ApiClient('');

export default function FieldDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [field, setField] = useState<Field | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);

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

  if (!field) return <Typography>Loading...</Typography>;

  return (
    <>
      <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Fields
      </Button>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>{field.name}</Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={field.field_type} color="primary" />
          {field.surface && <Chip label={field.surface} variant="outlined" />}
        </Box>
        {field.location && (
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {field.location}
          </Typography>
        )}
        {slots.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Weekly Availability</Typography>
            {slots.map((slot) => (
              <Typography key={slot.id} variant="body2">
                {DAY_NAMES[slot.day_of_week]}: {slot.start_time} - {slot.end_time}
              </Typography>
            ))}
          </Box>
        )}
      </Paper>
    </>
  );
}
