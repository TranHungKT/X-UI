import { DataFetchError } from './dataFetchError';

let error: DataFetchError;

describe('DataFetchError', () => {
  beforeEach(() => {
    error = new DataFetchError(400, { response: 'test' });
  });

  it('should return response test', () => {
    expect(error.response).toEqual({ response: 'test' });
  });

  it('should return status 400', () => {
    expect(error.status).toEqual(400);
  });
});
