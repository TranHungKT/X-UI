import { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGIN_PATH } from '../../constants/routes';
import useAuthorization from '../../utils/hooks/useAuthorization';

export const SecureRoute = (props: PropsWithChildren<{}>) => {
  const isAuthorized = useAuthorization();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthorized === false) {
      navigate(LOGIN_PATH, { replace: true });
    }
    if (isAuthorized === null) {
      return;
    }
  }, [navigate, isAuthorized]);

  return <>{props.children}</>;
};
