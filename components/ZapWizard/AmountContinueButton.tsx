import { Button, type ButtonProps } from "@mantine/core";
import { MouseEventHandler } from "react";

interface AmountContinueButtonProps extends ButtonProps {
  onClick: MouseEventHandler;
}

const AmountContinueButton = (props: AmountContinueButtonProps) => {
  return <Button {...props}>Continue</Button>;
};

export default AmountContinueButton;
