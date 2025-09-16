import { createTheme } from '@mui/material';

export const newspaperTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#FFD700',
    },
    background: {
      default: '#121212',
      paper: '#1a1a1a',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontFamily: "'Libre Baskerville', serif",
      fontSize: '3rem',
      fontWeight: 700,
      letterSpacing: '0.02em',
    },
    h2: {
      fontFamily: "'Libre Baskerville', serif",
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h3: {
      fontFamily: "'Libre Baskerville', serif",
      fontSize: '2rem',
      fontWeight: 700,
    },
    h4: {
      fontFamily: "'Libre Baskerville', serif",
      fontWeight: 700,
    },
    h5: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 500,
    },
    body1: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: "'Inter', sans-serif",
      lineHeight: 1.5,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1a1a1a',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          fontSize: '0.95rem',
          textTransform: 'none',
          padding: '8px 20px',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          fontSize: '0.95rem',
          textTransform: 'none',
        },
      },
    },
  },
});