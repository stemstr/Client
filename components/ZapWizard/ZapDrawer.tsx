import { type PropsWithChildren } from "react";
import { useZapWizard } from "./ZapWizardProvider";
import Drawer from "../Drawer/Drawer";
import { MantineTheme } from "@mantine/core";

interface ZapDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ZapDrawer = ({
  isOpen,
  onClose,
  children,
}: PropsWithChildren<ZapDrawerProps>) => {
  const { end, willShowCloseButton } = useZapWizard();

  return (
    <Drawer
      opened={isOpen}
      onClose={onClose}
      position="bottom"
      withCloseButton={false}
      trapFocus={false}
      styles={(theme: MantineTheme) => ({
        overlay: {
          backgroundColor: `${theme.colors.dark[7]} !important`,
          backdropFilter: "blur(16px)",
          opacity: `${0.5} !important`,
        },
        drawer: {
          backgroundColor: theme.colors.dark[8],
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          maxWidth: 600,
          margin: "auto",
          padding: `0 16px ${willShowCloseButton ? 48 : 24}px 16px !important`,
        },
      })}
      onDragEnd={end}
    >
      {children}
    </Drawer>
  );
};

export default ZapDrawer;
