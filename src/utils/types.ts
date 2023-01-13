export interface Converted {
  info: Info;
  query: Query;
  result: number;
  success: boolean;
}

interface Query {
  amount: number;
  from: string;
  to: string;
}

interface Info {
  quote: number;
  timestamp: number;
}

export type ConvertedResponseError = {
  code: number;
  info: string;
};
