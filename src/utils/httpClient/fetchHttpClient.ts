import { isEmpty } from 'lodash';
import qs from 'qs';

import { normalizeUrl } from '../normalizeUrl';

export type RequestHTTPClientRepeater<T = any> = (
  request: T,
) => Promise<FetchHTTPClientFulfilled<T>>;

export type RequestInterceptor<T = any> = (
  repeatRequest: RequestHTTPClientRepeater,
) => (data: T) => Promise<T>;

export type ResponseInterceptor<T = any> = (
  repeatRequest: RequestHTTPClientRepeater,
) => (error: FetchHTTPClientError<any, any> | null, data: T) => Promise<T>;

type ResponseType = 'blob' | 'json' | 'text';
type HTTPMethods = 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE';

export interface FetchHTTPClientConfig<P = any> {
  method?: HTTPMethods;
  url?: string;
  data?: P;
  params?: Record<string, any>;
  responseType?: ResponseType;
  headers?: Record<string, any>;
  withCredentials?: boolean;
  jsonContent?: boolean;
}

export interface FetchConfig {
  method?: HTTPMethods;
  body?: any;
  headers?: Record<string, any>;
  credentials?: 'omit' | 'same-origin' | 'include';
}

export interface MakeFetchHTTPClientConfig {
  baseUrl?: string;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
}

export interface FetchHTTPClientFulfilled<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, any>;
  nativeResponse: Response;
}

export interface FetchHTTPClientError<R, P extends Record<string, any>> {
  code?: string;
  request?: FetchHTTPClientConfig<P>;
  response?: FetchHTTPClientFulfilled<R>;
}

const buildParamsString = (params: Record<string, any>) => {
  return qs.stringify(params);
};

const buildRequestBody = <T>(body: T, jsonContent = false) => {
  return jsonContent ? JSON.stringify(body) : body;
};

const buildResponse = <T>(response: Response, payload: T): FetchHTTPClientFulfilled<T> => {
  return {
    data: payload,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    nativeResponse: response,
  };
};

const buildError = <R, P extends Record<string, any>>(
  response: FetchHTTPClientFulfilled<R>,
  config: FetchConfig,
): FetchHTTPClientError<R, P> => {
  return {
    code: String(response.status),
    request: config,
    response,
  };
};

const handleResponseError = async <R, P extends Record<string, any>>(
  response: Response,
  url: string,
  config: FetchHTTPClientConfig<P>,
) => {
  let errorBody: R;
  try {
    errorBody = await response.json();
  } catch (e) {
    throw buildError(buildResponse(response, response.statusText), { url, ...config });
  }
  throw buildError(buildResponse<R>(response, errorBody), { url, ...config });
};

const handleResponse = async <R>(response: Response, responseType: ResponseType) => {
  try {
    const responseBody = await response[responseType]();
    return buildResponse<R>(response, responseBody);
  } catch (e) {
    return buildResponse<R>(response, undefined as any);
  }
};

const executeRequestInterceptors = async <T>(
  interceptors: RequestInterceptor[],
  requestRepeater: () => ReturnType<typeof fetchHttpClient>,
  data: Promise<unknown>,
) =>
  interceptors.reduce(async (prevInterceptorResult, interceptor) => {
    const prevInterceptorData = await prevInterceptorResult;
    return interceptor(requestRepeater)(prevInterceptorData);
  }, data) as Promise<T>;

const executeResponseInterceptors = async <T>(
  interceptors: ResponseInterceptor[],
  requestRepeater: () => ReturnType<typeof fetchHttpClient>,
  data: Promise<unknown>,
) =>
  interceptors.reduce(async (prevInterceptorResult, interceptor) => {
    let prevInterceptorData: unknown;
    try {
      prevInterceptorData = await prevInterceptorResult;
      return interceptor(requestRepeater)(null, prevInterceptorData);
    } catch (e) {
      const fetchError = e as FetchHTTPClientError<any, any>;
      return interceptor(requestRepeater)(fetchError, null);
    }
  }, data) as Promise<T>;

const fetchHttpClient = async <R, P extends Record<string, any>>(
  url: string,
  config: FetchHTTPClientConfig<P>,
) => {
  const {
    data,
    params,
    withCredentials,
    jsonContent = true,
    responseType = 'json',
    ...restConfig
  } = config;

  const headers = jsonContent
    ? {
        'Content-Type': 'application/json',
      }
    : {};

  const commonConfig: FetchConfig = {
    ...restConfig,
    headers: {
      ...headers,
      ...config.headers,
    },
  };

  if (data) {
    commonConfig.body = buildRequestBody(data, jsonContent);
  }

  if (withCredentials) {
    commonConfig.credentials = 'include';
  }

  const urlWithParams = params && !isEmpty(params) ? `${url}?${buildParamsString(params)}` : url;
  const response = await fetch(urlWithParams, commonConfig);

  if (!response.ok) {
    return handleResponseError<R, P>(response, url, commonConfig);
  }

  return handleResponse<R>(response, responseType);
};

const buildUrl = (baseUrl: string, url: string) =>
  normalizeUrl(baseUrl ? `${baseUrl}/${url}` : url);

export const makeFetchHttpClient = ({
  baseUrl = '',
  requestInterceptors = [],
  responseInterceptors = [],
}: MakeFetchHTTPClientConfig = {}): typeof fetchHttpClient => {
  const request = async <R, P extends Record<string, any>>(
    url: string,
    config: FetchHTTPClientConfig<P>,
  ): Promise<FetchHTTPClientFulfilled<R>> => {
    const targetUrl = buildUrl(baseUrl, url);
    const interceptedConfig = await executeRequestInterceptors<FetchHTTPClientConfig<P>>(
      requestInterceptors,
      () => request<R, P>(url, config),
      Promise.resolve({ url: targetUrl, ...config } as FetchHTTPClientConfig<P>),
    );

    try {
      const response = await fetchHttpClient<R, P>(targetUrl, interceptedConfig);
      return executeResponseInterceptors(
        [...responseInterceptors],
        () => request<R, P>(url, config),
        Promise.resolve(response),
      );
    } catch (e) {
      return executeResponseInterceptors(
        [
          ...responseInterceptors,
          () =>
            <T>(error: FetchHTTPClientError<any, any> | null, data: T) => {
              if (error) {
                throw error;
              }
              return data;
            },
        ],
        () => request<R, P>(url, config),
        Promise.reject(e as FetchHTTPClientError<R, P>),
      );
    }
  };

  return request;
};
