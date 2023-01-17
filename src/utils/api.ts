import { Converted, ConvertedResponseError } from "./types";

const BASE_URL = "https://api.apilayer.com/exchangerates_data";
const API_KEY = "";

// TODO: what is the response type in the Promise? We should avoid using 'any'
type API = (params: {
  endpoint: string;
  params?: {
    base?: string;
    from?: string;
    to?: string;
    amount?: string;
  };
}) => Promise<any>;

var myHeaders = new Headers();
myHeaders.append("apikey", API_KEY);

const requestOptions: RequestInit = {
  method: "GET",
  redirect: "follow",
  headers: myHeaders,
};

const api: API = ({ endpoint, params = {} }) => {
  const searchParams = new URLSearchParams(params);
  const queryString = searchParams.toString();

  return fetch(`${BASE_URL}${endpoint}?${queryString}`, requestOptions);
};

export const fetchRates = async (baseCurrency: string) => {
  try {
    const response = await api({
      endpoint: "/latest",
      params: { base: baseCurrency },
    });
    const responseText = await response.text();
    const { rates, error } = JSON.parse(responseText);

    if (error) {
      throw new Error(error);
    }

    if (!rates || !Object.keys(rates).length) {
      throw new Error("Could not fetch rates.");
    }

    return rates;
  } catch (errorResponse) {
    throw errorResponse;
  }
};

export const fetchConversion = async (params: {
  fromAmount: string;
  fromCurrency: string;
  toCurrency: string;
}): Promise<Converted["result"] | ConvertedResponseError> => {
  const { fromAmount, fromCurrency, toCurrency } = params;

  try {
    const response = await api({
      endpoint: "/convert",
      params: { from: fromCurrency, to: toCurrency, amount: fromAmount },
    });

    const responseText = await response.text();
    const { result, error, success } = JSON.parse(responseText);

    if (!success) {
      return error as ConvertedResponseError;
    }

    return result;
  } catch (errorResponse) {
    throw errorResponse;
  }
};

export const fetchSymbols = async () => {
  try {
    const response = await api({
      endpoint: "/symbols",
    });

    const responseText = await response.text();
    const { symbols, error } = JSON.parse(responseText);

    if (error) {
      throw new Error(error);
    }

    if (!symbols || !Object.keys(symbols).length) {
      throw new Error("Could not fetch symbols.");
    }

    return symbols;
  } catch (errorResponse) {
    throw errorResponse;
  }
};
