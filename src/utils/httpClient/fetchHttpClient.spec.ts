import { FetchHTTPClientConfig, makeFetchHttpClient } from './fetchHttpClient';

describe('fetchHttpClient', () => {
  let fetchClient: ReturnType<typeof makeFetchHttpClient>;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  describe('request interceptors', () => {
    let firstMockRequestInterceptor: jest.Mock;
    let secondMockRequestInterceptor: jest.Mock;

    beforeEach(() => {
      firstMockRequestInterceptor = jest.fn(() => (request: FetchHTTPClientConfig) => ({
        ...request,
        headers: { ...request.headers, 'Content-Type': 'text/html' },
      }));

      secondMockRequestInterceptor = jest.fn(() => (request: FetchHTTPClientConfig) => ({
        ...request,
        headers: { ...request.headers, Authorization: 'Bearer token' },
      }));

      fetchClient = makeFetchHttpClient({
        requestInterceptors: [firstMockRequestInterceptor, secondMockRequestInterceptor],
      });
    });

    it('should pass request through interceptors', async () => {
      (global.fetch as jest.Mock).mockReturnValue(Promise.resolve({ ok: true, json: jest.fn() }));
      await fetchClient('/test', { method: 'GET' });

      expect(global.fetch).toHaveBeenCalledWith('/test', {
        url: '/test',
        method: 'GET',
        headers: { 'Content-Type': 'text/html', Authorization: 'Bearer token' },
      });
    });
  });
  describe('response interceptors', () => {
    it('should pass error response through interceptors', async () => {
      const mockResponseErrorInterceptor = jest.fn(() => () => {
        throw new Error('Interceptor error');
      });

      fetchClient = makeFetchHttpClient({
        responseInterceptors: [mockResponseErrorInterceptor],
      });

      (global.fetch as jest.Mock).mockReturnValue(
        Promise.resolve({
          ok: false,
          json: jest.fn().mockReturnValue(Promise.resolve()),
          status: 400,
          statusText: 'Bad request',
        }),
      );

      await expect(fetchClient('/test', { method: 'GET' })).rejects.toEqual(
        new Error('Interceptor error'),
      );
    });

    it('should pass error response through interceptors and returned resolved value', async () => {
      const jsonResponseMock = jest.fn();
      const mockResponseErrorInterceptor = jest.fn(
        () => () =>
          Promise.resolve({
            data: { a: 1 },
            status: 200,
            statusText: 'success',
            headers: {},
            nativeResponse: {
              status: 200,
              statusText: 'success',
              headers: {},
              json: jsonResponseMock,
            },
          }),
      );

      fetchClient = makeFetchHttpClient({
        responseInterceptors: [mockResponseErrorInterceptor],
      });

      (global.fetch as jest.Mock)
        .mockReturnValueOnce(
          Promise.resolve({
            ok: false,
            json: jest.fn().mockReturnValue(Promise.resolve()),
            status: 400,
            statusText: 'Bad request',
          }),
        )
        .mockReturnValueOnce(
          Promise.resolve({
            ok: true,
            json: jest.fn().mockReturnValue(Promise.resolve()),
            status: 200,
            statusText: 'success',
          }),
        );

      await expect(fetchClient('/test', { method: 'GET' })).resolves.toEqual({
        data: { a: 1 },
        status: 200,
        statusText: 'success',
        headers: {},
        nativeResponse: {
          status: 200,
          statusText: 'success',
          headers: {},
          json: jsonResponseMock,
        },
      });
    });
  });

  describe('baseUrl', () => {
    it('should attach baseUrl to the passed url when it is defined', async () => {
      (global.fetch as jest.Mock).mockReturnValue(Promise.resolve({ ok: true, json: jest.fn() }));

      const fetchClient = makeFetchHttpClient({
        baseUrl: '/test/api',
      });

      await fetchClient('endpoint', { method: 'GET' });

      expect(global.fetch).toHaveBeenCalledWith('/test/api/endpoint', {
        headers: {
          'Content-Type': 'application/json',
        },
        url: '/test/api/endpoint',
        method: 'GET',
      });
    });

    it('should not have duplicated "/" symbols between baseUrl and url', async () => {
      (global.fetch as jest.Mock).mockReturnValue(
        Promise.resolve({ ok: true, json: jest.fn().mockReturnValue(Promise.resolve()) }),
      );

      const fetchClient = makeFetchHttpClient({
        baseUrl: '/test/api/',
      });

      await fetchClient('/endpoint', { method: 'GET' });

      expect(global.fetch).toHaveBeenCalledWith('/test/api/endpoint', {
        headers: {
          'Content-Type': 'application/json',
        },
        url: '/test/api/endpoint',
        method: 'GET',
      });
    });

    it('should not append extra "/" symbol when baseUrl is empty', async () => {
      (global.fetch as jest.Mock).mockReturnValue(
        Promise.resolve({ ok: true, json: jest.fn().mockReturnValue(Promise.resolve()) }),
      );

      const fetchClient = makeFetchHttpClient();

      await fetchClient('endpoint', { method: 'GET' });

      expect(global.fetch).toHaveBeenCalledWith('endpoint', {
        headers: {
          'Content-Type': 'application/json',
        },
        url: 'endpoint',
        method: 'GET',
      });
    });

    it('should not append "/" symbol when url is an absolute path', async () => {
      (global.fetch as jest.Mock).mockReturnValue(
        Promise.resolve({ ok: true, json: jest.fn().mockReturnValue(Promise.resolve()) }),
      );

      const fetchClient = makeFetchHttpClient();

      await fetchClient('http://sts.com/endpoint', { method: 'GET' });

      expect(global.fetch).toHaveBeenCalledWith('http://sts.com/endpoint', {
        headers: {
          'Content-Type': 'application/json',
        },
        url: 'http://sts.com/endpoint',
        method: 'GET',
      });
    });
  });

  describe('fetching', () => {
    beforeEach(() => {
      fetchClient = makeFetchHttpClient();
    });

    it('should call fetch api with correct url and configuration', async () => {
      (global.fetch as jest.Mock).mockReturnValue(Promise.resolve({ ok: true, json: jest.fn() }));
      await fetchClient('/endpoint', { method: 'GET', headers: { Authorization: 'Bearer test' } });

      expect(global.fetch).toHaveBeenCalledWith('/endpoint', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test',
        },
        url: '/endpoint',
        method: 'GET',
      });
    });

    it('should serialize passed query params', async () => {
      (global.fetch as jest.Mock).mockReturnValue(
        Promise.resolve({ ok: true, json: jest.fn().mockReturnValue(Promise.resolve()) }),
      );
      await fetchClient('/endpoint', { method: 'GET', params: { a: '1', b: [2, 3] } });

      expect(global.fetch).toHaveBeenCalledWith('/endpoint?a=1&b%5B0%5D=2&b%5B1%5D=3', {
        headers: {
          'Content-Type': 'application/json',
        },
        url: '/endpoint',
        method: 'GET',
      });
    });

    it('should return success response in a correct format', async () => {
      const jsonResponseParser = jest.fn().mockReturnValue(Promise.resolve({ a: 1 }));
      (global.fetch as jest.Mock).mockReturnValue(
        Promise.resolve({
          ok: true,
          json: jsonResponseParser,
          status: 200,
          statusText: '200 Ok',
          headers: {},
        }),
      );
      const response = await fetchClient('/endpoint', { method: 'GET' });

      expect(response).toEqual({
        data: { a: 1 },
        status: 200,
        statusText: '200 Ok',
        headers: {},
        nativeResponse: {
          ok: true,
          json: jsonResponseParser,
          status: 200,
          statusText: '200 Ok',
          headers: {},
        },
      });
    });

    it('should return error response in a correct format', async () => {
      const jsonResponseParser = jest.fn().mockReturnValue(Promise.resolve({ a: 1 }));

      (global.fetch as jest.Mock).mockReturnValue(
        Promise.resolve({
          status: 500,
          statusText: 'error',
          json: jsonResponseParser,
          ok: false,
          headers: {},
        }),
      );

      await expect(fetchClient('/endpoint', { method: 'GET' })).rejects.toEqual({
        code: '500',
        response: {
          status: 500,
          statusText: 'error',
          data: { a: 1 },
          headers: {},
          nativeResponse: {
            ok: false,
            json: jsonResponseParser,
            status: 500,
            statusText: 'error',
            headers: {},
          },
        },
        request: {
          url: '/endpoint',
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      });
    });

    describe('responseType param', () => {
      beforeEach(() => {
        fetchClient = makeFetchHttpClient();
      });

      it('should parse response correctly when "json" responseType is passed', async () => {
        const jsonResponseParser = jest.fn().mockReturnValue(Promise.resolve({ a: 1 }));

        (global.fetch as jest.Mock).mockReturnValue(
          Promise.resolve({
            status: 200,
            statusText: 'ok',
            json: jsonResponseParser,
            ok: true,
            headers: {},
          }),
        );

        await expect(
          fetchClient('/endpoint', { method: 'GET', responseType: 'json' }),
        ).resolves.toEqual({
          status: 200,
          statusText: 'ok',
          data: { a: 1 },
          headers: {},
          nativeResponse: {
            ok: true,
            json: jsonResponseParser,
            status: 200,
            statusText: 'ok',
            headers: {},
          },
        });
      });

      it('should parse response correctly when "blob" responseType is passed', async () => {
        const mockBlob = new Blob([]);
        const blobResponseParser = jest.fn().mockReturnValue(Promise.resolve(mockBlob));

        (global.fetch as jest.Mock).mockReturnValue(
          Promise.resolve({
            status: 200,
            statusText: 'ok',
            blob: blobResponseParser,
            ok: true,
            headers: {},
          }),
        );

        await expect(
          fetchClient('/endpoint', { method: 'GET', responseType: 'blob' }),
        ).resolves.toEqual({
          status: 200,
          statusText: 'ok',
          data: mockBlob,
          headers: {},
          nativeResponse: {
            ok: true,
            blob: blobResponseParser,
            status: 200,
            statusText: 'ok',
            headers: {},
          },
        });
      });

      it('should parse response correctly when "text" responseType is passed', async () => {
        const textResponseParser = jest.fn().mockReturnValue(Promise.resolve('text'));

        (global.fetch as jest.Mock).mockReturnValue(
          Promise.resolve({
            status: 200,
            statusText: 'ok',
            text: textResponseParser,
            ok: true,
            headers: {},
          }),
        );

        await expect(
          fetchClient('/endpoint', { method: 'GET', responseType: 'text' }),
        ).resolves.toEqual({
          status: 200,
          statusText: 'ok',
          data: 'text',
          headers: {},
          nativeResponse: {
            ok: true,
            text: textResponseParser,
            status: 200,
            statusText: 'ok',
            headers: {},
          },
        });
      });
    });

    describe('jsonContent param', () => {
      beforeEach(() => {
        fetchClient = makeFetchHttpClient();
      });

      it('should add Content-Type: application/json header when jsonContent param is true', async () => {
        const jsonResponseParser = jest.fn().mockReturnValue(Promise.resolve({ a: 1 }));

        (global.fetch as jest.Mock).mockReturnValue(
          Promise.resolve({
            status: 200,
            statusText: 'ok',
            json: jsonResponseParser,
            ok: true,
            headers: {},
          }),
        );

        await fetchClient('/endpoint', { method: 'GET', jsonContent: true });

        expect(global.fetch).toHaveBeenCalledWith('/endpoint', {
          url: '/endpoint',
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
      });

      it('should not add Content-Type: application/json header when jsonContent param is false', async () => {
        const jsonResponseParser = jest.fn().mockReturnValue(Promise.resolve({ a: 1 }));

        (global.fetch as jest.Mock).mockReturnValue(
          Promise.resolve({
            status: 200,
            statusText: 'ok',
            json: jsonResponseParser,
            ok: true,
            headers: {},
          }),
        );

        await fetchClient('/endpoint', { method: 'GET', jsonContent: false });

        expect(global.fetch).toHaveBeenCalledWith('/endpoint', {
          url: '/endpoint',
          method: 'GET',
          headers: {},
        });
      });
    });

    describe('withCredentials param', () => {
      beforeEach(() => {
        fetchClient = makeFetchHttpClient();
      });

      it('should pass credentials: "include" param to the configuration of fetch', async () => {
        const jsonResponseParser = jest.fn().mockReturnValue(Promise.resolve({ a: 1 }));

        (global.fetch as jest.Mock).mockReturnValue(
          Promise.resolve({
            status: 200,
            statusText: 'ok',
            json: jsonResponseParser,
            ok: true,
            headers: {},
          }),
        );

        await fetchClient('/endpoint', { method: 'GET', withCredentials: true });

        expect(global.fetch).toHaveBeenCalledWith('/endpoint', {
          url: '/endpoint',
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
      });
    });
  });
});
