import { FetchHTTPClientConfig } from '../httpClient';
import { DataFetch, DataFetchFulfilled } from './dataFetch';

export class MockDataFetch implements DataFetch<FetchHTTPClientConfig> {
  private readonly _dataFetch: DataFetch<FetchHTTPClientConfig>;

  constructor(dataFetch: DataFetch<FetchHTTPClientConfig>) {
    this._dataFetch = dataFetch;
  }

  setRequestInterceptors(): void {}
  setResponseErrorInterceptors(): void {}

  async get<P extends Record<string, any> = {}, R = void>(
    url: string,
    params?: P,
    config?: FetchHTTPClientConfig,
  ): Promise<DataFetchFulfilled<R>> {
    return this._dataFetch.get(url, params, this._fillConfigWithMockParam<P>(config, params));
  }
  async post<P extends Record<string, any> = {}, R = void>(
    url: string,
    payload?: P,
    config?: FetchHTTPClientConfig,
  ): Promise<DataFetchFulfilled<R>> {
    return this._dataFetch.post(url, payload, this._fillConfigWithMockParam(config));
  }
  async put<P extends Record<string, any> = {}, R = void>(
    url: string,
    payload?: P,
    config?: FetchHTTPClientConfig,
  ): Promise<DataFetchFulfilled<R>> {
    return this._dataFetch.put(url, payload, this._fillConfigWithMockParam(config));
  }
  async patch<P extends Record<string, any> = {}, R = void>(
    url: string,
    payload?: P,
    config?: FetchHTTPClientConfig,
  ): Promise<DataFetchFulfilled<R>> {
    return this._dataFetch.patch(url, payload, this._fillConfigWithMockParam(config));
  }
  async delete<R = void>(
    url: string,
    config?: FetchHTTPClientConfig,
  ): Promise<DataFetchFulfilled<R>> {
    return this._dataFetch.delete(url, this._fillConfigWithMockParam(config));
  }

  private _fillConfigWithMockParam<P = any>(config?: FetchHTTPClientConfig, params?: P) {
    return { ...config, params: { ...config?.params, ...params, mock: true } };
  }
}
