import { useState } from 'react';
import {
  TextField, Button, MenuItem, Paper, Box,
  FormControl, InputLabel, Select, Chip, OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import type { Field, CreateFieldInput, FieldType, Surface,  } from '@field-scheduler/shared';

const FIELD_TYPES: FieldType[] = ['soccer', 'baseball', 'football', 'multi-purpose', 'tennis', 'basketball'];
const SURFACES: Surface[] = ['grass', 'turf', 'dirt', 'clay', 'hardcourt'];

interface Props {
  initialValues?: Field | null;
  onSubmit: (input: CreateFieldInput) => void;
}

export default function FieldForm({ initialValues, onSubmit }: Props) {
  const [name, setName] = useState(initialValues?.name || '');
  const [fieldType, setFieldType] = useState<FieldType>(initialValues?.field_type || 'soccer');
  const [surface, setSurface] = useState<Surface | ''>(initialValues?.surface || '');
  const [location, setLocation] = useState(initialValues?.location || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      field_type: fieldType,
      surface: surface || null,
      location: location || null,
    });
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Field Type"
          value={fieldType}
          onChange={(e) => setFieldType(e.target.value as FieldType)}
          select
          required
        >
          {FIELD_TYPES.map((t) => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Surface"
          value={surface}
          onChange={(e) => setSurface(e.target.value as Surface)}
          select
        >
          <MenuItem value="">None</MenuItem>
          {SURFACES.map((s) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Address or description"
        />
        <Button type="submit" variant="contained" size="large">
          {initialValues ? 'Update Field' : 'Create Field'}
        </Button>
      </Box>
    </Paper>
  );
}
