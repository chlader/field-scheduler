import { useState } from 'react';
import {
  TextField, Button, MenuItem, Paper, Box,
  FormControl, InputLabel, Select, Chip, OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import type { Field, CreateFieldInput, FieldType, Surface, Amenity } from '@field-scheduler/shared';

const FIELD_TYPES: FieldType[] = ['soccer', 'baseball', 'football', 'multi-purpose', 'tennis', 'basketball'];
const SURFACES: Surface[] = ['grass', 'turf', 'dirt', 'clay', 'hardcourt'];
const AMENITIES: Amenity[] = ['lights', 'restrooms', 'parking', 'bleachers', 'scoreboard', 'concessions', 'water_fountain'];

interface Props {
  initialValues?: Field | null;
  onSubmit: (input: CreateFieldInput) => void;
}

export default function FieldForm({ initialValues, onSubmit }: Props) {
  const [name, setName] = useState(initialValues?.name || '');
  const [fieldType, setFieldType] = useState<FieldType>(initialValues?.field_type || 'soccer');
  const [surface, setSurface] = useState<Surface | ''>(initialValues?.surface || '');
  const [location, setLocation] = useState(initialValues?.location || '');
  const [amenities, setAmenities] = useState<Amenity[]>(initialValues?.amenities || []);

  const handleAmenitiesChange = (e: SelectChangeEvent<Amenity[]>) => {
    setAmenities(e.target.value as Amenity[]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      field_type: fieldType,
      surface: surface || null,
      location: location || null,
      amenities,
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
        <FormControl>
          <InputLabel>Amenities</InputLabel>
          <Select
            multiple
            value={amenities}
            onChange={handleAmenitiesChange}
            input={<OutlinedInput label="Amenities" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((v) => (
                  <Chip key={v} label={v} size="small" />
                ))}
              </Box>
            )}
          >
            {AMENITIES.map((a) => (
              <MenuItem key={a} value={a}>{a}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" size="large">
          {initialValues ? 'Update Field' : 'Create Field'}
        </Button>
      </Box>
    </Paper>
  );
}
