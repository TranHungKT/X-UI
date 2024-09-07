import { HttpClientDataFetch, DataFetch } from '../utils/dataFetch';
import { FetchHTTPClientConfig } from '../utils/httpClient';

const API_URL = `http://localhost:8080/user-service/api/v1/auth`;

interface STSService {
  login(userData: LoginFlowRequest): Promise<String>;
}

export interface LoginFlowRequest {
  email: string;
  password: string;
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
        email: string;
        password: string;
      },
      String
    >(`${API_URL}/login`, userData);

    return responseData;
  }
}

export const stsService = new DefaultSTSService('');
