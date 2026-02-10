import { Box, Button, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import dayjs from 'dayjs';

interface Props {
  weekStart: string;
  weekEnd: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function WeekNavigator({ weekStart, weekEnd, onPrev, onNext, onToday }: Props) {
  const start = weekStart ? dayjs(weekStart).format('MMM D') : '';
  const end = weekEnd ? dayjs(weekEnd).format('MMM D, YYYY') : '';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton onClick={onPrev}>
        <ChevronLeftIcon />
      </IconButton>
      <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center' }}>
        {start && end ? `${start} - ${end}` : 'Loading...'}
      </Typography>
      <IconButton onClick={onNext}>
        <ChevronRightIcon />
      </IconButton>
      <Button variant="outlined" size="small" onClick={onToday}>
        Today
      </Button>
    </Box>
  );
}
