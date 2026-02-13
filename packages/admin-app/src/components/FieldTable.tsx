import { Link } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ScheduleIcon from '@mui/icons-material/Schedule';
import type { Field } from '@field-scheduler/shared';

interface Props {
  fields: Field[];
  onDelete: (id: number) => void;
}

export default function FieldTable({ fields, onDelete }: Props) {
  if (fields.length === 0) {
    return <Paper sx={{ p: 3, textAlign: 'center' }}>No fields yet. Add one to get started.</Paper>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Surface</TableCell>
            <TableCell>Location</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((field) => (
            <TableRow key={field.id}>
              <TableCell>{field.name}</TableCell>
              <TableCell>{field.field_type}</TableCell>
              <TableCell>{field.surface || '—'}</TableCell>
              <TableCell>{field.location || '—'}</TableCell>
              <TableCell align="right">
                <Tooltip title="Availability">
                  <IconButton component={Link} to={`/fields/${field.id}/availability`} color="primary">
                    <ScheduleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton component={Link} to={`/fields/${field.id}/edit`} color="primary">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => onDelete(field.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
