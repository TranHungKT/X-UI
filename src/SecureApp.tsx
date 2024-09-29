import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import { useQuery } from '@tanstack/react-query';
import { userServices } from './services/userServices';
import InitialPage from './pages/InitialPage/InitialPage';

export default function SecureApp() {
  const { data } = useQuery({
    queryKey: ['getUserData'],
    queryFn: () => userServices.getUserData('96751bae-00d0-4b73-b59f-4ffa8112e04c'),
  });

  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/home/asd" element={<InitialPage />} />
      <Route path="/asssssd" element={<HomePage />} />
    </Routes>
  );
}
