import { DataFetch, DataFetchFulfilled, DataFetchOptions } from '@Shared/utils/dataFetch/dataFetch';
import { DataFetchError } from '@Shared/utils/dataFetch/dataFetchError';
import {
  FetchHTTPClientConfig,
  FetchHTTPClientError,
  makeFetchHttpClient,
} from '@Shared/utils/httpClient';

import { authRequestInterceptor, authResponseInterceptor } from '../../services/interceports';

export class HttpClientDataFetch implements DataFetch<FetchHTTPClientConfig> {
  private readonly _fetchHttpClient: ReturnType<typeof makeFetchHttpClient>;

  constructor(
    baseURL: string,
    {
      requestInterceptors = [authRequestInterceptor],
      responseInterceptors = [authResponseInterceptor],
    }: DataFetchOptions = {},
  ) {
    this._fetchHttpClient = makeFetchHttpClient({
      baseUrl: baseURL,
      requestInterceptors,
      responseInterceptors,
    });
  }
  setRequestInterceptors(): void {}
  setResponseErrorInterceptors(): void {}

  async get<P extends Record<string, any> = {}, R = void>(
    url: string,
    params?: P,
    config?: FetchHTTPClientConfig,
  ): Promise<DataFetchFulfilled<R>> {
    try {
      const response = await this._fetchHttpClient<R, {}>(url, {
        params,
        method: 'GET',
        ...config,
      });
      return response;
    } catch (e) {
      const error = e as FetchHTTPClientError<{}, any>;
      throw new DataFetchError(error.response?.status, error.response?.data);
    }
  }
  async post<P extends Record<string, any> = {}, R = void>(
    url: string,
    payload?: P,
    config?: FetchHTTPClientConfig<P>,
  ): Promise<DataFetchFulfilled<R>> {
    try {
      const response = await this._fetchHttpClient<R, P>(url, {
        method: 'POST',
        data: payload,
        ...config,
      });
      return response;
    } catch (e) {
      const error = e as FetchHTTPClientError<{}, any>;
      throw new DataFetchError(error.response?.status, error.response?.data);
    }
  }
  async put<P extends Record<string, any> = {}, R = void>(
    url: string,
    payload?: P,
    config?: FetchHTTPClientConfig<P>,
  ): Promise<DataFetchFulfilled<R>> {
    try {
      const response = await this._fetchHttpClient<R, P>(url, {
        method: 'PUT',
        data: payload,
        ...config,
      });
      return response;
    } catch (e) {
      const error = e as FetchHTTPClientError<{}, any>;
      throw new DataFetchError(error.response?.status, error.response?.data);
    }
  }
  async patch<P extends Record<string, any> = {}, R = void>(
    url: string,
    payload?: P,
    config?: FetchHTTPClientConfig<P>,
  ): Promise<DataFetchFulfilled<R>> {
    try {
      const response = await this._fetchHttpClient<R, P>(url, {
        method: 'PATCH',
        data: payload,
        ...config,
      });
      return response;
    } catch (e) {
      const error = e as FetchHTTPClientError<{}, any>;
      throw new DataFetchError(error.response?.status, error.response?.data);
    }
  }
  async delete<R = void>(
    url: string,
    config?: FetchHTTPClientConfig,
  ): Promise<DataFetchFulfilled<R>> {
    try {
      const response = await this._fetchHttpClient<R, {}>(url, { method: 'DELETE', ...config });
      return response;
    } catch (e) {
      const error = e as FetchHTTPClientError<{}, any>;
      throw new DataFetchError(error.response?.status, error.response?.data);
    }
  }
}
