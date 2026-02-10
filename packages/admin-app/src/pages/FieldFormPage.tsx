import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import type { Field, CreateFieldInput } from '@field-scheduler/shared';
import { ApiClient } from '@field-scheduler/shared';
import FieldForm from '../components/FieldForm';

const api = new ApiClient('');

export default function FieldFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [field, setField] = useState<Field | null>(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (id) {
      api.getField(Number(id))
        .then(setField)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (input: CreateFieldInput) => {
    try {
      if (isEdit && id) {
        await api.updateField(Number(id), input);
      } else {
        await api.createField(input);
      }
      navigate('/fields');
    } catch (err) {
      console.error('Failed to save field:', err);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Edit Field' : 'Add New Field'}
      </Typography>
      <FieldForm initialValues={field} onSubmit={handleSubmit} />
    </>
  );
}
