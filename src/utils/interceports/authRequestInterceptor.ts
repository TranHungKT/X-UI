import { FetchHTTPClientConfig } from '../../utils/httpClient';
import { stsService } from '../../services/authServices';

const addAuthorizationHeader = (accessToken: string, config: FetchHTTPClientConfig) => ({
  ...config,
  headers: { ...config.headers, Authorization: `Bearer ${accessToken}` },
});

export const authRequestInterceptor = () => async (config: FetchHTTPClientConfig) => {
  try {
    const token = getLocalStorage();
    if (!token?.expired) {
      return addAuthorizationHeader(user, config);
    }

    if (!token) {
      throw new Error('Not authorized');
    }
    const renewedToken = await stsService.renewToken();
    if (!renewToken) {
      throw new Error('Not authorized');
    }
    return addAuthorizationHeader(renewToken, config);
  } catch (e) {
    console.info(e);
  }
};
