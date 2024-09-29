import { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGIN_PATH } from '../../constants/routes';

export const SecureRoute = (props: PropsWithChildren<{}>) => {
  // const isAuthenticated = false;
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate(LOGIN_PATH);
  //   }
  // }, [isAuthenticated, navigate]);

  // // TODO: HANDLE AUTHENTICATION
  // if (!isAuthenticated) {
  //   return null;
  // }

  return <>{props.children}</>;
};
