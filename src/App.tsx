import React from 'react';
import './App.css';
import LoginPage from './pages/Login/LoginPage';
import { createTheme, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    dark: true,
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <LoginPage />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
