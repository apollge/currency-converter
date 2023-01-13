import { CloseIcon } from "@chakra-ui/icons";
import { Box, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";

import { Amount } from "../utils/types";

interface PreviousAmountProps {
  amount: Amount;
  deletePreviousAmount: (id: number) => void;
}

const PreviousAmount: FC<PreviousAmountProps> = ({
  amount,
  deletePreviousAmount,
}) => {
  const { id, fromAmount, fromCurrency, result, toCurrency } = amount;

  return (
    <Box bgColor="gray.100" borderWidth={1} borderRadius="md" w="100%" p={3}>
      <HStack justify="space-between">
        <VStack align="start" spacing={0}>
          <Text size="sm">{`${fromAmount} ${fromCurrency}`} equals</Text>
          <Text fontSize="2xl">
            {result} {toCurrency}
          </Text>
        </VStack>

        <IconButton
          aria-label="reverse"
          bg="transparent"
          icon={<CloseIcon />}
          size="lg"
          onClick={() => deletePreviousAmount(id)}
        />
      </HStack>
    </Box>
  );
};

export default PreviousAmount;
