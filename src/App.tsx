import React from 'react';
import './App.css';
import LoginPage from './pages/Login/LoginPage';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    dark: true,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LoginPage />
    </ThemeProvider>
  );
}

export default App;
