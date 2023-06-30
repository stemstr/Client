import { Flex, type FlexProps } from "@mantine/core";
import { type PropsWithChildren } from "react";
import { useMediaQuery } from "@mantine/hooks";

const SquareButtonRow = ({
  children,
  ...rest
}: PropsWithChildren<FlexProps>) => {
  const satsButtonRowPx = useMediaQuery("(max-width: 480px)") ? 32 : 64;

  return (
    <Flex justify="space-between" px={satsButtonRowPx} {...rest}>
      {children}
    </Flex>
  );
};

export default SquareButtonRow;
