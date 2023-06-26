import { Button, Flex } from "@mantine/core";
import { MouseEventHandler } from "react";

interface DrawerCloseButtonProps {
  onClick: MouseEventHandler;
}

const DrawerCloseButton = ({ onClick }: DrawerCloseButtonProps) => {
  return (
    <Flex justify="center" mt={-11}>
      <Button
        variant="subtle"
        styles={(theme) => ({
          root: {
            color: theme.white,
            "&:hover": {
              backgroundColor: "transparent",
            },
          },
        })}
        onClick={onClick}
      >
        Close
      </Button>
    </Flex>
  );
};

export default DrawerCloseButton;
