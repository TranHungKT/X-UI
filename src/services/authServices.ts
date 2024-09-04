import { HttpClientDataFetch, DataFetch } from '../utils/dataFetch';
import { FetchHTTPClientConfig } from '../utils/httpClient';

const API_URL = `localhost:8080/user-service/api/v1/auth`;

interface STSService {
  login(userData: LoginFlowRequest): Promise<String>;
  logout(logoutId: string): Promise<LogoutSuccessResponse>;
  renewToken(refreshToken: string): Promise<String>;
}

export enum AuthenticationStep {
  AUTHENTICATOR_SETUP,
  MFA_CODE_VERIFICATION,
  SUCCESS,
  CREDENTIALS,
  RECOVERY_CODES,
}

export interface LoginFlowRequest {
  username: string;
  password: string;
}

export interface LogoutSuccessResponse {
  showSignoutPrompt: boolean;
  clientName: string;
  postLogoutRedirectUri: string;
  signOutIFrameUrl: string;
  logoutId: string;
}

class DefaultSTSService implements STSService {
  private readonly _dataFetch: DataFetch<FetchHTTPClientConfig>;

  constructor(baseURL: string) {
    this._dataFetch = new HttpClientDataFetch(baseURL, {
      requestInterceptors: [],
      responseInterceptors: [],
    });
  }

  async login(userData: LoginFlowRequest) {
    const { data: responseData } = await this._dataFetch.post<
      {
        username: string;
        password: string;
      },
      String
    >(API_URL, userData, { withCredentials: true });

    return responseData;
  }

  async renewToken(refreshToken: String) {
    const { data: responseData } = await this._dataFetch.post<
      {
        refreshToken: String;
      },
      String
    >(API_URL, { refreshToken });
    return responseData;
  }

  async logout(logoutId: string) {
    const response = await this._dataFetch.get<{ logoutId: string }, LogoutSuccessResponse>(
      `${API_URL}logout`,
      { logoutId },
      { withCredentials: true },
    );

    return response.data;
  }
}

export const stsService = new DefaultSTSService('');
