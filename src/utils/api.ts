import { Converted, ConvertedResponseError } from "./types";

const BASE_URL = "https://api.apilayer.com/";
const API_KEY = "kBemlfOZaW5GxVLJV9RbHbDiLW3ifm5C";

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
      endpoint: "exchangerates_data/latest",
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
      endpoint: "currency_data/convert",
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

export const fetchCurrencies = async () => {
  try {
    const response = await api({
      endpoint: "currency_data/list",
    });

    const responseText = await response.text();
    const { currencies, error } = JSON.parse(responseText);

    if (error) {
      throw new Error(error);
    }

    if (!currencies || !Object.keys(currencies).length) {
      throw new Error("Could not fetch currencies.");
    }

    return currencies;
  } catch (errorResponse) {
    throw errorResponse;
  }
};
