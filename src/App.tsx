import React from 'react';
import './App.css';
import LoginPage from './pages/Login/LoginPage';
import { createTheme, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';
import { SecureRoute } from './components/SecureRoute/SecureRoute';
import SecureApp from './SecureApp';
import { LOGIN_PATH } from './constants/routes';

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
        <Routes>
          <Route path={LOGIN_PATH} element={<LoginPage />} />

          <Route
            path="*"
            element={
              <SecureRoute>
                <SecureApp />
              </SecureRoute>
            }
          />
        </Routes>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
