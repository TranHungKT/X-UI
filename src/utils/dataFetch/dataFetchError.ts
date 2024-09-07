export type ErrorCode = { code: string };
export type ErrorCodesList = ErrorCode[];

interface ErrorDetails {
  location: string;
  field: string;
  issue: string;
}

export class DataFetchError<R = ErrorData> extends Error {
  constructor(public status: number | undefined, public response: R) {
    super();
  }
}

export interface ErrorData {
  errorId: string;
  message: string;
  details?: ErrorDetails[];
}
