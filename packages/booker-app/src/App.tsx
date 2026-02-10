import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import FieldListPage from './pages/FieldListPage';
import FieldDetailPage from './pages/FieldDetailPage';
import CalendarPage from './pages/CalendarPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Field Scheduler
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Fields
          </Button>
          <Button color="inherit" component={Link} to="/calendar">
            Calendar
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ mt: 3 }}>
          <Routes>
            <Route path="/" element={<FieldListPage />} />
            <Route path="/fields/:id" element={<FieldDetailPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes>
        </Box>
      </Container>
    </BrowserRouter>
  );
}
