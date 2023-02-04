import React from "react";
import { Stack, Flex, Heading, Text } from "@chakra-ui/react";

export interface NetworkScreenProps {
  onLine: boolean;
}

const preset = {
  bgColor: "#074174",
  textColor: "#fff",
};

export const NetworkScreen: React.FC<NetworkScreenProps> = () => {
  return (
    <Flex
      h="100vh"
      overflow="hidden"
      zIndex={10}
      alignItems="center"
      justifyContent="center"
      bg={preset.bgColor}
      color={preset.textColor}
    >
      <Stack spacing={2} width="auto" pos="relative" textAlign="center">
        <Heading fontSize="4xl">
          We are currently experiencing technical difficulties.
        </Heading>
        <Text fontSize="2xl">
          Please check back later or contact your administrator for more
        </Text>
        <Text color="gray.300">
          Status:&nbsp;<span>Network is offline</span>
        </Text>
      </Stack>
    </Flex>
  );
};
