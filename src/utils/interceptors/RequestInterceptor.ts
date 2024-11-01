import Cookies from 'js-cookie';

import { FetchHTTPClientConfig } from '../httpClient';

const addAuthorizationHeader = (accessToken: string, config: FetchHTTPClientConfig) => ({
  ...config,
  headers: { ...config.headers, Authorization: `Bearer ${accessToken}` },
});

export const authRequestInterceptor = () => async (config: FetchHTTPClientConfig) => {
  if (Cookies.get('token')) {
    return addAuthorizationHeader(Cookies.get('token') as string, config);
  }
};
