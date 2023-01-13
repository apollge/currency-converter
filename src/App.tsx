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
import { ConvertedResponseError } from "./utils/types";

const App: FC = () => {
  const [text, setText] = useState("");
  const [parsedInput, setParsedInput] = useState({
    fromAmount: 0,
    fromCurrency: "",
    toCurrency: "",
  });
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<number | ConvertedResponseError>();

  const [currencies, setCurrencies] = useState<any>([]);

  const getCurrencies = async () => {
    try {
      const result = await fetchCurrencies();
      setCurrencies(result);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    // getCurrencies();
  }, []);

  const handleConvert = async () => {
    setError(undefined);

    if (!text) {
      setError("Please enter a value");
      return;
    }

    setIsLoading(true);

    const parsedInput = parseInput(text);
    setParsedInput(parsedInput);

    try {
      const result = await fetchConversion({
        ...parsedInput,
        fromAmount: String(parsedInput.fromAmount),
      });

      if (typeof result === "number") {
        setResult(result);
      }
    } catch (error: any) {
      setError(error?.info ?? error.message);
    }

    setIsLoading(false);
  };

  const handleReverse = () => {
    setText(
      `${parsedInput.toCurrency} ${parsedInput.fromAmount} to ${parsedInput.fromCurrency}`
    );
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
                    disabled={isLoading}
                    isLoading={isLoading}
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
              result={Number(result)}
              toCurrency={currencies[parsedInput.toCurrency]}
            />
          )}
        </VStack>
      </Container>
    </div>
  );
};

export default App;
