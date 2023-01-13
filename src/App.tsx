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
import { FC, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import { fetchConversion } from "./utils/api";
import { parseInput } from "./utils/parseInput";

const App: FC = () => {
  const [text, setText] = useState("");
  const [parsedInput, setParsedInput] = useState({
    fromAmount: 0,
    fromCurrency: "",
    toCurrency: "",
  });
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState();

  const handleConvert = async () => {
    setError(undefined);
    setIsLoading(true);

    if (!text) {
      setError("Please enter a value");
      return;
    }

    try {
      const parsedInput = parseInput(text);
      setParsedInput(parsedInput);

      const result = await fetchConversion({
        ...parsedInput,
        fromAmount: String(parsedInput.fromAmount),
      });

      setResult(result);
    } catch (error: any) {
      setError(error.message);
    }

    setIsLoading(false);
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
          {result && <Text>{result}</Text>}
        </VStack>
      </Container>
    </div>
  );
};

export default App;
