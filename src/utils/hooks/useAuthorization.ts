import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import { userServices } from '../../services/userServices';
import { useAppDispatch } from '../../store/reduxHook';
import { saveUserData } from '../../store/users/userSlice';

export default function useAuthorization() {
  const userId = Cookies.get('userId');

  const { data, isSuccess, isFetched, isError } = useQuery({
    queryKey: ['getUserData'],
    queryFn: () => userServices.getUserData(userId || ''),
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
