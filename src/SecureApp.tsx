import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import { useQuery } from '@tanstack/react-query';
import { userServices } from './services/userServices';
import InitialPage from './pages/InitialPage/InitialPage';
import { useEffect } from 'react';
import { saveUserData } from './store/users/userSlice';
import { useAppDispatch, useAppSelector } from './store/reduxHook';

export default function SecureApp() {
  const { data, isSuccess } = useQuery({
    queryKey: ['getUserData'],
    queryFn: () => userServices.getUserData('96751bae-00d0-4b73-b59f-4ffa8112e04c'),
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data && isSuccess) {
      dispatch(saveUserData(data));
    }
  }, [data, dispatch, isSuccess]);

  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/home/asd" element={<InitialPage />} />
      <Route path="/asssssd" element={<HomePage />} />
    </Routes>
  );
}
