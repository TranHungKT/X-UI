import { RequestInterceptor, ResponseInterceptor } from '../httpClient';

export interface DataFetchFulfilled<T> {
  data: T;
}

export type RequestRepeater<T = any> = (request?: T) => Promise<DataFetchFulfilled<any>>;
export type Interceptor<T = any> = (repeatRequest: RequestRepeater) => (data: T) => Promise<T>;

export interface DataFetchOptions {
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
}

export interface BaseConfig {
  params?: Record<string, any>;
}

export interface DataFetch<Config extends BaseConfig> {
  get<P extends Record<string, any> = {}, R = unknown>(
    url: string,
    params?: P,
    config?: Config,
  ): Promise<DataFetchFulfilled<R>>;
  post<P extends Record<string, any> = {}, R = unknown>(
    url: string,
    payload?: P,
    config?: Config,
  ): Promise<DataFetchFulfilled<R>>;
  put<P extends Record<string, any> = {}, R = unknown>(
    url: string,
    payload?: P,
    config?: Config,
  ): Promise<DataFetchFulfilled<R>>;
  patch<P extends Record<string, any> = {}, R = unknown>(
    url: string,
    payload?: P,
    config?: Config,
  ): Promise<DataFetchFulfilled<R>>;
  delete<R = void>(url: string, config?: Config): Promise<DataFetchFulfilled<R>>;
  setRequestInterceptors(interceptors: Interceptor[]): void;
  setResponseErrorInterceptors(interceptors: Interceptor[]): void;
}
