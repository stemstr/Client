import { type PropsWithChildren } from "react";
import { Box, DefaultProps } from "@mantine/core";

export function MaxWidthContainer({
  children,
  ...rest
}: PropsWithChildren<DefaultProps>) {
  return (
    <Box mx="auto" pl="md" pr="md" w="100%" maw={600} {...rest}>
      {children}
    </Box>
  );
}
