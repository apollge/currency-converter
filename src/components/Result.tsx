import { RepeatIcon } from "@chakra-ui/icons";
import { Box, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";

interface ResultProps {
  fromAmount: number;
  fromCurrency: string;
  result: number;
  toCurrency: string;
}

const Result: FC<ResultProps> = ({
  fromAmount,
  fromCurrency,
  result,
  toCurrency,
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
          size="lg"
          icon={<RepeatIcon />}
        />
      </HStack>
    </Box>
  );
};

export default Result;
