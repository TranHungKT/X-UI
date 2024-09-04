import { RequestRepeater } from '../dataFetch';
import { FetchHTTPClientConfig, FetchHTTPClientError } from '../httpClient';

import { authService, getDefaultUserState } from '../../services/authServices';

export const authResponseInterceptor =
  (repeatRequest: RequestRepeater<FetchHTTPClientConfig>) =>
  async <T>(error: FetchHTTPClientError<any, any> | null, data: T) => {
    if (error?.response?.status === 401) {
      try {
        await authService.renewToken();
        return repeatRequest();
      } catch (e) {
        authService.singIn(getDefaultUserState());
      }
    }
    if (error) {
      throw error;
    }

    return data;
  };
