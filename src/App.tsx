import { SearchIcon } from "@chakra-ui/icons";
import {
  Alert,
  Container,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import Result from "./components/Result";
import { fetchConversion, fetchCurrencies } from "./utils/api";
import { parseInput } from "./utils/parseInput";
import { ConvertedResponseError, ParsedInput } from "./utils/types";

const App: FC = () => {
  const [text, setText] = useState("");
  const [parsedInput, setParsedInput] = useState<ParsedInput>({
    fromAmount: 0,
    fromCurrency: "",
    toCurrency: "",
  });
  const [error, setError] = useState<string | undefined>();
  const [isConversionLoading, setIsConversionLoading] = useState(false);
  const [isReverseConversionLoading, setIsReverseConversionLoading] =
    useState(false);
  const [result, setResult] = useState<number | ConvertedResponseError>();

  const [currencies, setCurrencies] = useState<any>();

  const getCurrencies = async () => {
    try {
      const result = await fetchCurrencies();
      setCurrencies(result);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    getCurrencies();
  }, []);

  const getConversion = async (parsedInput: ParsedInput) => {
    try {
      const result = await fetchConversion({
        ...parsedInput,
        fromAmount: String(parsedInput.fromAmount),
      });

      if (typeof result === "number") {
        setResult(result);
      } else {
        setError(result.info);
      }
    } catch (error: any) {
      setError(error?.info ?? error.message);
    }
  };

  const handleConvert = async () => {
    setError(undefined);

    if (!text) {
      setError("Please enter a value");
      return;
    }

    setIsConversionLoading(true);

    const parsedInput = parseInput(text);
    setParsedInput(parsedInput);

    await getConversion(parsedInput);

    setIsConversionLoading(false);
  };

  const handleReverse = async () => {
    setIsReverseConversionLoading(true);
    const parsedText = parseInput(
      `${parsedInput.fromAmount} ${parsedInput.toCurrency} to ${parsedInput.fromCurrency}`
    );
    setParsedInput(parsedText);

    await getConversion(parsedText);

    setIsReverseConversionLoading(false);
  };

  return (
    <div className="app">
      <Container>
        <VStack gap={4}>
          <Header />

          {/* Input */}
          <VStack w="full">
            <InputGroup>
              <Input
                placeholder="e.g. 1 AUD to USD"
                w="100%"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <InputRightElement
                children={
                  <IconButton
                    aria-label="convert"
                    icon={<SearchIcon />}
                    onClick={handleConvert}
                    disabled={isConversionLoading}
                    isLoading={isConversionLoading}
                  />
                }
              />
            </InputGroup>
            {error && (
              <Alert status="error" p={1}>
                <Text color="red.500">{error}</Text>
              </Alert>
            )}
          </VStack>

          {/* Result */}
          {result && (
            <Result
              fromAmount={parsedInput.fromAmount}
              fromCurrency={currencies[parsedInput.fromCurrency]}
              isLoading={isReverseConversionLoading}
              result={Number(result)}
              toCurrency={currencies[parsedInput.toCurrency]}
              handleReverse={handleReverse}
            />
          )}
        </VStack>
      </Container>
    </div>
  );
};

export default App;
