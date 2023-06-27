import { isDesktop } from "react-device-detect";
import { Button, type ButtonProps } from "@mantine/core";
import { MouseEventHandler } from "react";

interface AmountContinueButtonProps extends ButtonProps {
  onClick: MouseEventHandler;
}

const AmountContinueButton = (props: AmountContinueButtonProps) => {
  return (
    <Button {...props}>{isDesktop ? "Continue" : "Pay with wallet"}</Button>
  );
};

export default AmountContinueButton;
