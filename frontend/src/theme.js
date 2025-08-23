
import { createTheme } from '@mui/material/styles';


// Screenshot-inspired palette
// White: #FFFFFF
// Light lavender: #F6F7FB
// Soft purple: #B6A4E6
// Accent purple: #7C5CFC
// Dark text: #232323

export const getTheme = (mode = 'light') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#7C5CFC',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#B6A4E6',
      contrastText: '#232323',
    },
    background: {
      default: mode === 'light' ? '#F6F7FB' : '#232323',
      paper: mode === 'light' ? '#FFFFFF' : '#232323',
    },
    text: {
      primary: mode === 'light' ? '#232323' : '#F6F7FB',
      secondary: mode === 'light' ? '#7C5CFC' : '#B6A4E6',
    },
    accent: {
      main: '#B6A4E6',
    },
    neutral: {
      main: '#F6F7FB',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#232323',
          color: mode === 'light' ? '#232323' : '#F6F7FB',
          boxShadow: 'none',
        },
      },
    },
  },
});