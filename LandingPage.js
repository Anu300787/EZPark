import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Button, MenuItem, Select, Card, Grid, useMediaQuery, TextField, Dialog, Snackbar, Alert, AppBar, Toolbar, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import HistoryIcon from '@mui/icons-material/History';
import mall1 from './assets/mall1.jpg';
import mall2 from './assets/mall2.jpg';
import mall3 from './assets/mall3.jpg';
import states from './data/states';
import { getMalls, bookParkingSlot, saveBooking } from './data/mallData';
import ParkingTicket from './components/ParkingTicket';
import BookingHistory from './components/BookingHistory';

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${mall1})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '90vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  textShadow: '2px 2px 4px #000',
  padding: theme.spacing(2),
  textAlign: 'center'
}));

const SelectionContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing(2),
  gap: theme.spacing(2)
}));

const SlotSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6, 2),
  backgroundColor: '#f5f5f5',
  minHeight: '50vh'
}));

const MallCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
    cursor: 'pointer'
  }
}));

const MallLanding = () => {
  const slotsRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedState, setSelectedState] = useState('');
  const [selectedMall, setSelectedMall] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    vehicleNumber: '',
    entryTime: '',
    exitTime: ''
  });
  const [showTicket, setShowTicket] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [malls, setMalls] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [showHistory, setShowHistory] = useState(false);

  // Load malls from localStorage on component mount
  useEffect(() => {
    const loadMalls = () => {
      const mallData = getMalls();
      setMalls(mallData);
    };
    
    loadMalls();
  }, []);

  const scrollToSlots = () => {
    slotsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedMall('');
  };

  const handleBooking = (mall) => {
    setSelectedMall(mall.id);
    setShowBooking(true);
  };

  const handleBookingSubmit = () => {
    if (!bookingDetails.vehicleNumber || !bookingDetails.entryTime || !bookingDetails.exitTime) {
      setNotification({
        open: true,
        message: 'Please fill in all booking details',
        severity: 'error'
      });
      return;
    }

    // Book the parking slot
    const updatedMalls = bookParkingSlot(selectedMall);
    setMalls(updatedMalls);
    
    const mall = updatedMalls.find(m => m.id === selectedMall);
    const booking = {
      mallName: mall.name,
      slotNumber: `A${Math.floor(Math.random() * 100) + 1}`,
      ...bookingDetails
    };
    
    // Save booking to localStorage
    const savedBooking = saveBooking(booking);
    
    setTicketDetails(savedBooking);
    setShowBooking(false);
    setShowTicket(true);
    
    setNotification({
      open: true,
      message: 'Booking successful! Your ticket has been generated.',
      severity: 'success'
    });
    
    // Reset booking details
    setBookingDetails({
      vehicleNumber: '',
      entryTime: '',
      exitTime: ''
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleShowHistory = () => {
    setShowHistory(true);
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
  };

  const filteredMalls = malls.filter(mall => !selectedState || mall.state === selectedState);

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            EzPark
          </Typography>
          <IconButton color="primary" onClick={handleShowHistory} aria-label="booking history">
            <HistoryIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <HeroSection>
        <Typography variant={isMobile ? "h4" : "h2"}>Welcome to EzPark</Typography>
        <Typography variant={isMobile ? "body1" : "h5"} sx={{ mt: 2 }}>
          Find, Park, and Go with Ease
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size={isMobile ? "medium" : "large"}
          sx={{ mt: 4, backgroundColor: '#ff4081', '&:hover': { backgroundColor: '#f50057' } }}
          onClick={scrollToSlots}
        >
          View Parking Slots
        </Button>
      </HeroSection>

      <SelectionContainer>
        <Typography variant="h6">Select State:</Typography>
        <Select
          value={selectedState}
          onChange={handleStateChange}
          displayEmpty
          fullWidth={isMobile}
          sx={{ backgroundColor: '#fff', borderRadius: 2, minWidth: isMobile ? '90%' : 200 }}
        >
          <MenuItem value="">All States</MenuItem>
          {states.map((state) => (
            <MenuItem key={state} value={state}>{state}</MenuItem>
          ))}
        </Select>

        <Typography variant="h6">Available Malls:</Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {filteredMalls.map((mall) => (
            <Grid item xs={12} sm={6} md={4} key={mall.id}>
              <MallCard onClick={() => handleBooking(mall)}>
                <Box>
                  <Typography variant="h6" gutterBottom>{mall.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Location: {mall.state}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Available Slots: {mall.slotsAvailable} / {mall.totalSlots}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={mall.slotsAvailable === 0}
                >
                  {mall.slotsAvailable === 0 ? 'No Slots Available' : 'Book Now'}
                </Button>
              </MallCard>
            </Grid>
          ))}
        </Grid>
      </SelectionContainer>

      <Dialog open={showBooking} onClose={() => setShowBooking(false)}>
        <Box sx={{ p: 3, minWidth: 300 }}>
          <Typography variant="h6" gutterBottom>Book Parking Slot</Typography>
          <TextField
            fullWidth
            label="Vehicle Number"
            value={bookingDetails.vehicleNumber}
            onChange={(e) => setBookingDetails({ ...bookingDetails, vehicleNumber: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Entry Time"
            type="datetime-local"
            value={bookingDetails.entryTime}
            onChange={(e) => setBookingDetails({ ...bookingDetails, entryTime: e.target.value })}
            sx={{ mb: 2 }}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            label="Expected Exit Time"
            type="datetime-local"
            value={bookingDetails.exitTime}
            onChange={(e) => setBookingDetails({ ...bookingDetails, exitTime: e.target.value })}
            sx={{ mb: 2 }}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleBookingSubmit}
          >
            Confirm Booking
          </Button>
        </Box>
      </Dialog>

      <Dialog open={showTicket} onClose={() => setShowTicket(false)} maxWidth="sm" fullWidth>
        {ticketDetails && <ParkingTicket booking={ticketDetails} />}
      </Dialog>

      <Dialog 
        open={showHistory} 
        onClose={handleCloseHistory}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ p: 2 }}>
          <BookingHistory />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="contained" onClick={handleCloseHistory}>
              Close
            </Button>
          </Box>
        </Box>
      </Dialog>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MallLanding;