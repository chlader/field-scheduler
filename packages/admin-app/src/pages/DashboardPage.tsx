import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Paper, Box, Button, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import type { Field } from '@field-scheduler/shared';
import { ApiClient } from '@field-scheduler/shared';

const api = new ApiClient('');

export default function DashboardPage() {
  const [fields, setFields] = useState<Field[]>([]);

  useEffect(() => {
    api.getFields().then(setFields).catch(console.error);
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h2" color="primary">
              {fields.length}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Active Fields
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <Typography variant="h6">Quick Actions</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component={Link}
              to="/fields/new"
              fullWidth
            >
              Add New Field
            </Button>
            <Button
              variant="outlined"
              startIcon={<ListIcon />}
              component={Link}
              to="/fields"
              fullWidth
            >
              Manage Fields
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
