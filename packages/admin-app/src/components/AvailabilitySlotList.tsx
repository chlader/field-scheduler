import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DAY_NAMES } from '@field-scheduler/shared';
import type { AvailabilitySlot } from '@field-scheduler/shared';

interface Props {
  slots: AvailabilitySlot[];
  onDelete: (slotId: number) => void;
}

export default function AvailabilitySlotList({ slots, onDelete }: Props) {
  if (slots.length === 0) {
    return <Paper sx={{ p: 3, textAlign: 'center' }}>No availability slots defined yet.</Paper>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Day</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {slots.map((slot) => (
            <TableRow key={slot.id}>
              <TableCell>{DAY_NAMES[slot.day_of_week]}</TableCell>
              <TableCell>{slot.start_time}</TableCell>
              <TableCell>{slot.end_time}</TableCell>
              <TableCell align="right">
                <Tooltip title="Delete">
                  <IconButton onClick={() => onDelete(slot.id)} color="error">
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
