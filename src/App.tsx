import { CloseIcon, RepeatIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Alert,
  Button,
  Container,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card";

import Header from "./components/Header";
import { fetchConversion, fetchSymbols } from "./utils/api";
import { parseInput } from "./utils/parseInput";
import { Amount, ConvertedResponseError, ParsedInput } from "./utils/types";

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

  const [amounts, setAmounts] = useState<Amount[] | undefined>();

  useEffect(() => {
    const fetchPreviousAmounts = async () => {
      const response = await fetch("http://localhost:5000/amounts");
      const data = await response.json();

      setAmounts(data);
    };

    fetchPreviousAmounts();
  }, []);

  const getSymbols = async () => {
    try {
      const result = await fetchSymbols();
      setCurrencies(result);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    getSymbols();
  }, []);

  const getConversion = async (parsedInput: ParsedInput) => {
    try {
      const result = await fetchConversion({
        ...parsedInput,
        fromAmount: String(parsedInput.fromAmount),
      });

      if (typeof result === "number") {
        setResult(result);

        await addPreviousAmount({
          fromAmount: parsedInput.fromAmount,
          fromCurrency: currencies[parsedInput.fromCurrency],
          result: Number(result),
          toCurrency: currencies[parsedInput.toCurrency],
        });
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

  const addPreviousAmount = async (amount: Omit<Amount, "id">) => {
    const response = await fetch("http://localhost:5000/amounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(amount),
    });

    const data = await response.json();

    setAmounts((prev) => [...(prev ?? []), data]);
  };

  const deletePreviousAmount = async (id: Amount["id"]) => {
    await fetch(`http://localhost:5000/amounts/${id}`, {
      method: "DELETE",
    });

    setAmounts(amounts?.filter((amount) => amount.id !== id));
  };

  const deleteAllPreviousAmounts = async () => {
    if (!amounts) {
      return;
    }

    const amountIds = amounts.map((amount) => amount.id);
    const promises = amountIds.map(async (id) => {
      await deletePreviousAmount(id);
    });

    await Promise.all(promises);

    setAmounts([]);
  };

  return (
    <div className="app">
      <Container>
        <VStack gap={3} mb={10}>
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
            <Card
              amount={{
                fromAmount: parsedInput.fromAmount,
                fromCurrency: currencies[parsedInput.fromCurrency],
                toCurrency: currencies[parsedInput.toCurrency],
                result: Number(result),
              }}
              iconButtonProps={{
                "aria-label": "reverse",
                icon: <RepeatIcon />,
                isLoading: isReverseConversionLoading,
                disabled: isReverseConversionLoading,
                onClick: handleReverse,
              }}
            />
          )}
        </VStack>

        {/* Previous Amounts */}
        {amounts?.length !== 0 && (
          <VStack gap={1}>
            <HStack width="100%" justify="space-between" alignItems="center">
              <Heading as="h2" size="lg">
                Previous Amounts
              </Heading>
              <Button size="sm" onClick={deleteAllPreviousAmounts}>
                Clear All
              </Button>
            </HStack>
            {amounts?.map((amount) => (
              <Card
                key={amount.id}
                amount={amount}
                boxProps={{
                  bgColor: "gray.100",
                }}
                iconButtonProps={{
                  "aria-label": "delete",
                  icon: <CloseIcon />,
                  onClick: () => deletePreviousAmount(amount.id),
                }}
              />
            ))}
          </VStack>
        )}
      </Container>
    </div>
  );
};

export default App;
