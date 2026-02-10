import { Link } from 'react-router-dom';
import { Card, CardContent, CardActionArea, Typography, Chip, Box } from '@mui/material';
import type { Field } from '@field-scheduler/shared';

interface Props {
  field: Field;
}

export default function FieldCard({ field }: Props) {
  return (
    <Card>
      <CardActionArea component={Link} to={`/fields/${field.id}`}>
        <CardContent>
          <Typography variant="h6" gutterBottom>{field.name}</Typography>
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
            <Chip label={field.field_type} size="small" color="primary" />
            {field.surface && <Chip label={field.surface} size="small" variant="outlined" />}
          </Box>
          {field.location && (
            <Typography variant="body2" color="text.secondary">
              {field.location}
            </Typography>
          )}
          {field.amenities.length > 0 && (
            <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {field.amenities.map((a) => (
                <Chip key={a} label={a} size="small" variant="outlined" />
              ))}
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
