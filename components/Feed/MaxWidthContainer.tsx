import { type PropsWithChildren } from "react";
import { Box } from "@mantine/core";

export function MaxWidthContainer({ children }: PropsWithChildren<{}>) {
  return (
    <Box m="auto" pl="md" pr="md" w="100%" sx={{ maxWidth: 600 }}>
      {children}
    </Box>
  );
}
