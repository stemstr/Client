import { Box, Flex, type FlexProps } from "@mantine/core";

const DrawerHandle = (props: FlexProps) => (
  <Flex justify="center" {...props}>
    <Box w={56} h={5} bg="gray.5" sx={{ borderRadius: 12 }} />
  </Flex>
);

export default DrawerHandle;
