import { useQuery } from '@tanstack/react-query';
import { userServices } from '../../services/userServices';
import { useAppDispatch } from '../../store/reduxHook';
import { useEffect } from 'react';
import { saveUserData } from '../../store/users/userSlice';

export default function useAuthorization() {
  const { data, isSuccess, isFetched, isError } = useQuery({
    queryKey: ['getUserData'],
    queryFn: () => userServices.getUserData('96751bae-00d0-4b73-b59f-4ffa8112e04c'),
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data && isSuccess) {
      dispatch(saveUserData(data));
    }
  }, [data, dispatch, isSuccess]);

  if (isFetched && isError) {
    return false;
  }
  if (isFetched && isSuccess) {
    return true;
  }
  return null;
}
