import { UserDetails } from '../models/user';
import { DataFetch, HttpClientDataFetch } from '../utils/dataFetch';
import { FetchHTTPClientConfig } from '../utils/httpClient';
import { authRequestInterceptor } from '../utils/interceptors/RequestInterceptor';

interface UserService {
  getUserData(id: String): Promise<UserDetails>;
}

const API_URL = `http://localhost:8080/user-service/api/v1/users`;

class UserServices implements UserService {
  private readonly _dataFetch: DataFetch<FetchHTTPClientConfig>;

  constructor(baseURL: string) {
    this._dataFetch = new HttpClientDataFetch(baseURL, {
      requestInterceptors: [authRequestInterceptor],
      responseInterceptors: [],
    });
  }

  async getUserData(id: String): Promise<UserDetails> {
    const { data: responseData } = await this._dataFetch.get(`/${id}`);

    return responseData as UserDetails;
  }
}

export const userServices = new UserServices(API_URL);
