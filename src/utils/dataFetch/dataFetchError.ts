export type ErrorCode = { code: string };
export type ErrorCodesList = ErrorCode[];

export class DataFetchError<R = unknown> extends Error {
  constructor(public status: number | undefined, public response: R) {
    super();
  }
}

export interface ErrorData {
  code: string;
  message: string;
}
