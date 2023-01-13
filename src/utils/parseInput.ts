type ParseInput = (input: string) => {
  fromAmount: number;
  fromCurrency: string;
  toCurrency: string
}

export const parseInput: ParseInput = (input) => {
  // expected input: 1 EUR to USD
  // TODO: parse or tokenize the input string

  return {
    fromAmount: 0,
    fromCurrency: '',
    toCurrency: '',
  };
};
