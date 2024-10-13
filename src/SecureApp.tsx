import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import InitialPage from './pages/InitialPage/InitialPage';

export default function SecureApp() {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/home/asd" element={<InitialPage />} />
      <Route path="/asssssd" element={<HomePage />} />
    </Routes>
  );
}
