import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MallLanding from './LandingPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0072ff'
    },
    secondary: {
      main: '#ff4081'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MallLanding />
    </ThemeProvider>
  );
}

export default App;