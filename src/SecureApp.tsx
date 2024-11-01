import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import InitialPage from './pages/InitialPage/InitialPage';
import { Box, CssBaseline } from '@mui/material';
import SideBar from './components/SideBar/SideBar';
import React from 'react';

export default function SecureApp() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <SideBar />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/explore/" element={<InitialPage text="explore" />} />
        <Route path="/notifications/" element={<InitialPage text="notifications" />} />
        <Route path="/messages/" element={<InitialPage text="messages" />} />
        <Route path="/bookmarks/" element={<InitialPage text="bookmarks" />} />
        <Route path="/lists/" element={<InitialPage text="lists" />} />
        <Route path="/profile/" element={<InitialPage text="profile" />} />
        <Route path="/more/" element={<InitialPage text="more" />} />
      </Routes>
    </Box>
  );
}
