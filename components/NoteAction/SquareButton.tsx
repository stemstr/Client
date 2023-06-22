import { Button, Stack, Text } from "@mantine/core";
import withStopClickPropagation from "utils/hoc/withStopClickPropagation";
import { type MouseEventHandler, type PropsWithChildren } from "react";
import useStyles from "./SquareButton.styles";

interface NoteActionZapButtonProps {
  onClick: MouseEventHandler;
  mainContent: number | string;
  isHighlighted?: boolean;
}

const SquareButton = ({
  onClick,
  mainContent,
  isHighlighted,
  children,
}: PropsWithChildren<NoteActionZapButtonProps>) => {
  const { classes } = useStyles();

  return (
    <Button
      className={isHighlighted ? classes.highlightedButton : classes.button}
      onClick={onClick}
    >
      <Stack ta="center" spacing={5}>
        <Text size={17} fw="bold">
          {mainContent.toLocaleString()}
        </Text>
        <Text color="rgba(255, 255, 255, 0.4)" size="xs" fw={400}>
          {children}
        </Text>
      </Stack>
    </Button>
  );
};

export default withStopClickPropagation(SquareButton);
