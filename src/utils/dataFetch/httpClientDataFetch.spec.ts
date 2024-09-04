import { makeFetchHttpClient } from '../httpClient';
import { DataFetchError } from './dataFetchError';
import { HttpClientDataFetch } from './httpClientDataFetch';

jest.mock('../httpClient', () => {
  const fetchHttpClientMock = jest.fn();

  return {
    makeFetchHttpClient: () => fetchHttpClientMock,
  };
});

describe('httpClientDataFetch', () => {
  let fetchHttpClientMock: jest.Mock;
  let httpClientDataFetch: HttpClientDataFetch;

  beforeEach(() => {
    fetchHttpClientMock = makeFetchHttpClient() as jest.Mock;
    httpClientDataFetch = new HttpClientDataFetch('/base');
  });

  afterEach(() => {
    fetchHttpClientMock.mockRestore();
  });

  it('should call fetchHttpClient with method GET', async () => {
    fetchHttpClientMock.mockReturnValue(Promise.resolve({ a: 1 }));
    const response = await httpClientDataFetch.get(
      '/endpoint',
      { p: 1 },
      {
        jsonContent: false,
      },
    );

    expect(fetchHttpClientMock).toHaveBeenCalledWith('/endpoint', {
      jsonContent: false,
      method: 'GET',
      params: { p: 1 },
    });
    expect(response).toEqual({ a: 1 });
  });

  it('should call fetchHttpClient with method POST', async () => {
    fetchHttpClientMock.mockReturnValue(Promise.resolve({ a: 1 }));
    const response = await httpClientDataFetch.post(
      '/endpoint',
      { p: 1 },
      {
        withCredentials: true,
      },
    );

    expect(fetchHttpClientMock).toHaveBeenCalledWith('/endpoint', {
      withCredentials: true,
      method: 'POST',
      data: { p: 1 },
    });
    expect(response).toEqual({ a: 1 });
  });

  it('should call fetchHttpClient with method PUT', async () => {
    fetchHttpClientMock.mockReturnValue(Promise.resolve({ a: 1 }));
    const response = await httpClientDataFetch.put(
      '/endpoint',
      { p: 1 },
      {
        withCredentials: true,
      },
    );

    expect(fetchHttpClientMock).toHaveBeenCalledWith('/endpoint', {
      withCredentials: true,
      method: 'PUT',
      data: { p: 1 },
    });
    expect(response).toEqual({ a: 1 });
  });

  it('should call fetchHttpClient with method PATCH', async () => {
    fetchHttpClientMock.mockReturnValue(Promise.resolve({ a: 1 }));
    const response = await httpClientDataFetch.patch(
      '/endpoint',
      { p: 1 },
      {
        withCredentials: true,
      },
    );

    expect(fetchHttpClientMock).toHaveBeenCalledWith('/endpoint', {
      withCredentials: true,
      method: 'PATCH',
      data: { p: 1 },
    });
    expect(response).toEqual({ a: 1 });
  });

  it('should call fetchHttpClient with method DELETE', async () => {
    fetchHttpClientMock.mockReturnValue(Promise.resolve({ a: 1 }));
    const response = await httpClientDataFetch.delete('/endpoint', {
      withCredentials: true,
    });

    expect(fetchHttpClientMock).toHaveBeenCalledWith('/endpoint', {
      withCredentials: true,
      method: 'DELETE',
    });
    expect(response).toEqual({ a: 1 });
  });

  describe('errors', () => {
    it('should return correct error after GET', async () => {
      fetchHttpClientMock.mockReturnValue(
        Promise.reject({ status: 400, response: { data: { a: 1 } } }),
      );

      await expect(
        httpClientDataFetch.get('/endpoint', {
          withCredentials: true,
        }),
      ).rejects.toEqual(new DataFetchError(400, { a: 1 }));
    });

    it('should return correct error after POST', async () => {
      fetchHttpClientMock.mockReturnValue(
        Promise.reject({ status: 400, response: { data: { a: 1 } } }),
      );

      await expect(
        httpClientDataFetch.post('/endpoint', {
          withCredentials: true,
        }),
      ).rejects.toEqual(new DataFetchError(400, { a: 1 }));
    });

    it('should return correct error after PUT', async () => {
      fetchHttpClientMock.mockReturnValue(
        Promise.reject({ status: 400, response: { data: { a: 1 } } }),
      );

      await expect(
        httpClientDataFetch.put('/endpoint', {
          withCredentials: true,
        }),
      ).rejects.toEqual(new DataFetchError(400, { a: 1 }));
    });

    it('should return correct error after PATCH', async () => {
      fetchHttpClientMock.mockReturnValue(
        Promise.reject({ status: 400, response: { data: { a: 1 } } }),
      );

      await expect(
        httpClientDataFetch.patch('/endpoint', {
          withCredentials: true,
        }),
      ).rejects.toEqual(new DataFetchError(400, { a: 1 }));
    });

    it('should return correct error after DELETE', async () => {
      fetchHttpClientMock.mockReturnValue(
        Promise.reject({ status: 400, response: { data: { a: 1 } } }),
      );

      await expect(
        httpClientDataFetch.delete('/endpoint', {
          withCredentials: true,
        }),
      ).rejects.toEqual(new DataFetchError(400, { a: 1 }));
    });
  });
});
