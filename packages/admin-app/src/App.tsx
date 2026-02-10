import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import DashboardPage from './pages/DashboardPage';
import FieldListPage from './pages/FieldListPage';
import FieldFormPage from './pages/FieldFormPage';
import AvailabilityPage from './pages/AvailabilityPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Field Scheduler Admin
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/fields">
            Fields
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ mt: 3 }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/fields" element={<FieldListPage />} />
            <Route path="/fields/new" element={<FieldFormPage />} />
            <Route path="/fields/:id/edit" element={<FieldFormPage />} />
            <Route path="/fields/:id/availability" element={<AvailabilityPage />} />
          </Routes>
        </Box>
      </Container>
    </BrowserRouter>
  );
}
