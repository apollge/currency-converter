import { RepeatIcon } from "@chakra-ui/icons";
import { Box, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";

interface ResultProps {
  fromAmount: number;
  fromCurrency: string;
  isLoading: boolean;
  result: number;
  toCurrency: string;
  handleReverse: () => void;
}

const Result: FC<ResultProps> = ({
  fromAmount,
  fromCurrency,
  isLoading,
  result,
  toCurrency,
  handleReverse,
}) => {
  return (
    <Box borderWidth={1} borderRadius="md" w="100%" p={3}>
      <HStack justify="space-between">
        <VStack align="start">
          <Text size="sm">{`${fromAmount} ${fromCurrency}`} equals</Text>
          <Text fontSize="2xl">
            {result} {toCurrency}
          </Text>
        </VStack>

        <IconButton
          aria-label="reverse"
          bg="transparent"
          disabled={isLoading}
          isLoading={isLoading}
          icon={<RepeatIcon />}
          size="lg"
          onClick={handleReverse}
        />
      </HStack>
    </Box>
  );
};

export default Result;
