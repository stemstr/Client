import { Button, Stack, Text } from "@mantine/core";
import withStopClickPropagation from "utils/hoc/withStopClickPropagation";
import { type MouseEventHandler } from "react";
import useStyles from "./SatsButton.styles";

interface NoteActionZapButtonProps {
  onClick: MouseEventHandler;
  satsAmount: number | string;
  btcPrice?: number;
  isHighlighted?: boolean;
}

const SatsButton = ({
  onClick,
  satsAmount,
  btcPrice,
  isHighlighted,
}: NoteActionZapButtonProps) => {
  const { classes } = useStyles();
  const getFiatAmount = () => {
    if (typeof satsAmount === "string") {
      return "...";
    }

    if (!btcPrice) {
      return "";
    }

    return (btcPrice / (100_000_000 / satsAmount)).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <Button
      className={isHighlighted ? classes.highlightedButton : classes.button}
      onClick={onClick}
    >
      <Stack ta="center" spacing={5}>
        <Text size={17} fw="bold">
          {satsAmount.toLocaleString()}
        </Text>
        <Text color="rgba(255, 255, 255, 0.4)" size="xs" fw={400}>
          {getFiatAmount()}
        </Text>
      </Stack>
    </Button>
  );
};

export default withStopClickPropagation(SatsButton);
