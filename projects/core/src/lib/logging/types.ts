export interface LogData {
  msg: string;
  data?: any;
  dataToString?(data: any): string;
}

export type MessageType = string | LogData | (() => string | LogData);
export type ErrorType = Error | (() => Error);
