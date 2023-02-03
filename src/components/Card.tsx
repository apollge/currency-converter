import {
  Box,
  BoxProps,
  HStack,
  IconButton,
  IconButtonProps,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FC } from "react";
import { Amount } from "../utils/types";

interface CardProps {
  amount: Omit<Amount, "id">;
  boxProps?: BoxProps;
  iconButtonProps: IconButtonProps;
}

const Card: FC<CardProps> = ({ amount, boxProps, iconButtonProps }) => {
  const { fromAmount, fromCurrency, result, toCurrency } = amount;

  return (
    <Box borderWidth={1} borderRadius="md" w="100%" p={3} {...boxProps}>
      <HStack justify="space-between">
        <VStack align="start" spacing={0}>
          <Text size="sm">{`${fromAmount} ${fromCurrency}`} equals</Text>
          <Text fontSize="2xl">
            {result} {toCurrency}
          </Text>
        </VStack>

        <IconButton bg="transparent" size="lg" {...iconButtonProps} />
      </HStack>
    </Box>
  );
};

export default Card;
