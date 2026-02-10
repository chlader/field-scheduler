import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { Field, AvailabilitySlot, CreateAvailabilitySlotInput } from '@field-scheduler/shared';
import { ApiClient } from '@field-scheduler/shared';
import AvailabilitySlotForm from '../components/AvailabilitySlotForm';
import AvailabilitySlotList from '../components/AvailabilitySlotList';

const api = new ApiClient('');

export default function AvailabilityPage() {
  const { id } = useParams<{ id: string }>();
  const fieldId = Number(id);
  const [field, setField] = useState<Field | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);

  const loadData = async () => {
    try {
      const [f, s] = await Promise.all([
        api.getField(fieldId),
        api.getAvailability(fieldId),
      ]);
      setField(f);
      setSlots(s);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [fieldId]);

  const handleAdd = async (input: CreateAvailabilitySlotInput) => {
    await api.createAvailabilitySlot(fieldId, input);
    loadData();
  };

  const handleDelete = async (slotId: number) => {
    await api.deleteAvailabilitySlot(slotId);
    loadData();
  };

  if (!field) return <Typography>Loading...</Typography>;

  return (
    <>
      <Button component={Link} to="/fields" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Fields
      </Button>
      <Typography variant="h4" gutterBottom>
        Availability: {field.name}
      </Typography>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <Typography variant="h6" gutterBottom>
            Add Slot
          </Typography>
          <AvailabilitySlotForm onSubmit={handleAdd} />
        </Box>
        <Box sx={{ flex: '2 1 400px', minWidth: 400 }}>
          <Typography variant="h6" gutterBottom>
            Current Slots
          </Typography>
          <AvailabilitySlotList slots={slots} onDelete={handleDelete} />
        </Box>
      </Box>
    </>
  );
}
