import { Box, Tooltip, Typography } from '@mui/material';

interface Props {
  fieldName: string;
  startTime: string;
  endTime: string;
  color: string;
  topPercent: number;
  heightPercent: number;
  leftPercent: number;
  widthPercent: number;
  onClick?: () => void;
}

export default function AvailabilityBlock({
  fieldName,
  startTime,
  endTime,
  color,
  topPercent,
  heightPercent,
  leftPercent,
  widthPercent,
  onClick,
}: Props) {
  return (
    <Tooltip title={`${fieldName}: ${startTime} - ${endTime}`}>
      <Box
        onClick={onClick}
        sx={{
          position: 'absolute',
          top: `${topPercent}%`,
          height: `${heightPercent}%`,
          left: `${leftPercent}%`,
          width: `${widthPercent}%`,
          bgcolor: color,
          opacity: 0.8,
          borderRadius: 1,
          px: 0.5,
          overflow: 'hidden',
          cursor: 'pointer',
          '&:hover': { opacity: 1 },
        }}
      >
        <Typography variant="caption" sx={{ color: 'white', fontWeight: 500, lineHeight: 1.2 }}>
          {fieldName}
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', display: 'block', fontSize: '0.65rem' }}>
          {startTime}-{endTime}
        </Typography>
      </Box>
    </Tooltip>
  );
}
