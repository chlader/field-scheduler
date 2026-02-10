import { useEffect, useState } from 'react';
import { Typography, Grid } from '@mui/material';
import type { Field } from '@field-scheduler/shared';
import { ApiClient } from '@field-scheduler/shared';
import FieldCard from '../components/FieldCard';

const api = new ApiClient('');

export default function FieldListPage() {
  const [fields, setFields] = useState<Field[]>([]);

  useEffect(() => {
    api.getFields().then(setFields).catch(console.error);
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Available Fields
      </Typography>
      {fields.length === 0 ? (
        <Typography color="text.secondary">No fields available yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {fields.map((field) => (
            <Grid item xs={12} sm={6} md={4} key={field.id}>
              <FieldCard field={field} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
