type ParseInput = (input: string) => {
  fromAmount: number;
  fromCurrency: string;
  toCurrency: string;
};

export const INVALID_INPUT_STRUCTURE = "Invalid input structure";

export const parseInput: ParseInput = (input) => {
  // validate expected input: 1 EUR to USD

  // throw error if empty string
  if (!input) {
    throw new Error(INVALID_INPUT_STRUCTURE);
  }

  // parse or tokenize the input string
  const [fromAmount, fromCurrency, , toCurrency] = input.split(" ");

  // validate the input
  if (!fromAmount || !fromCurrency || !toCurrency) {
    throw new Error(INVALID_INPUT_STRUCTURE);
  }

  // validate fromAmount if number
  if (isNaN(Number(fromAmount))) {
    throw new Error(INVALID_INPUT_STRUCTURE);
  }

  return {
    fromAmount: Number(fromAmount),
    fromCurrency: fromCurrency.toUpperCase(),
    toCurrency: toCurrency.toUpperCase(),
  };
};
