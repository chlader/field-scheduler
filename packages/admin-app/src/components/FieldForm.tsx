import { useState } from 'react';
import {
  TextField, Button, MenuItem, Paper, Box,
  FormControlLabel, Switch,
} from '@mui/material';
import type { Field, CreateFieldInput, FieldType, Surface } from '@field-scheduler/shared';

const FIELD_TYPES: FieldType[] = [
  'soccer', 'baseball', 'football', 'multi-purpose', 'tennis', 'basketball',
  'softball', 'lacrosse', 'rugby', 'cricket', 'pickleball', 'volleyball',
];
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
  const [description, setDescription] = useState(initialValues?.description || '');
  const [size, setSize] = useState(initialValues?.size || '');
  const [photoUrl, setPhotoUrl] = useState(initialValues?.photo_url || '');
  const [hasLights, setHasLights] = useState(initialValues?.has_lights ?? false);
  const [hasParking, setHasParking] = useState(initialValues?.has_parking ?? false);
  const [isIndoor, setIsIndoor] = useState(initialValues?.is_indoor ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      field_type: fieldType,
      surface: surface || null,
      location: location || null,
      description: description || null,
      size: size || null,
      photo_url: photoUrl || null,
      has_lights: hasLights,
      has_parking: hasParking,
      is_indoor: isIndoor,
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
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
        />
        <TextField
          label="Size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="e.g. 100x60 yards"
        />
        <TextField
          label="Photo URL"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          placeholder="Image URL"
        />
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={<Switch checked={hasLights} onChange={(e) => setHasLights(e.target.checked)} />}
            label="Lights"
          />
          <FormControlLabel
            control={<Switch checked={hasParking} onChange={(e) => setHasParking(e.target.checked)} />}
            label="Parking"
          />
          <FormControlLabel
            control={<Switch checked={isIndoor} onChange={(e) => setIsIndoor(e.target.checked)} />}
            label="Indoor"
          />
        </Box>
        <Button type="submit" variant="contained" size="large">
          {initialValues ? 'Update Field' : 'Create Field'}
        </Button>
      </Box>
    </Paper>
  );
}
