import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { Field } from '@field-scheduler/shared';
import { ApiClient } from '@field-scheduler/shared';
import FieldTable from '../components/FieldTable';

const api = new ApiClient('');

export default function FieldListPage() {
  const [fields, setFields] = useState<Field[]>([]);

  const loadFields = () => {
    api.getFields().then(setFields).catch(console.error);
  };

  useEffect(() => {
    loadFields();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this field?')) return;
    try {
      await api.deleteField(id);
      loadFields();
    } catch (err) {
      console.error('Failed to delete field:', err);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Fields</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/fields/new"
        >
          Add Field
        </Button>
      </Box>
      <FieldTable fields={fields} onDelete={handleDelete} />
    </>
  );
}
