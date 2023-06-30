import { Box, Flex, FlexProps } from "@mantine/core";

const ZapDrawerHandle = (props: FlexProps) => (
  <Flex justify="center" {...props}>
    <Box w={56} h={5} bg="gray.5" sx={{ borderRadius: 12 }} />
  </Flex>
);

export default ZapDrawerHandle;
