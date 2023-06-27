import {
  Button,
  type ButtonProps,
  Stack,
  Text,
  type TextProps,
} from "@mantine/core";
import withStopClickPropagation from "utils/hoc/withStopClickPropagation";
import { type MouseEventHandler, type PropsWithChildren } from "react";
import useStyles from "./SquareButton.styles";

interface SquareButtonProps extends ButtonProps {
  onClick: MouseEventHandler;
  label: string | number;
  labelProps: TextProps;
  isHighlighted?: boolean;
}

const SquareButton = ({
  onClick,
  label,
  labelProps,
  isHighlighted,
  children,
  ...rest
}: PropsWithChildren<SquareButtonProps>) => {
  const { classes } = useStyles();
  const getClassName = () => {
    if (rest?.variant === "subtle") {
      return classes.subtleButton;
    }

    return isHighlighted ? classes.highlightedButton : classes.button;
  };

  return (
    <Button {...rest} className={getClassName()} onClick={onClick}>
      <Stack ta="center" spacing={5}>
        <Text size={16} fw="bold" {...labelProps}>
          {label.toLocaleString()}
        </Text>
        <Text color="rgba(255, 255, 255, 0.4)" size="xs" fw={400}>
          {children}
        </Text>
      </Stack>
    </Button>
  );
};

export default withStopClickPropagation(SquareButton);
