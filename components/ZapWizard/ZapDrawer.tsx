import { Drawer as MantineDrawer, type MantineTheme } from "@mantine/core";
import withStopClickPropagation from "../../utils/hoc/withStopClickPropagation";
import { MouseEventHandler, type PropsWithChildren } from "react";

const Drawer = withStopClickPropagation(MantineDrawer);

interface ZapDrawerProps {
  isOpen: boolean;
  onClose: MouseEventHandler;
  size: number;
}

const ZapDrawer = ({
  isOpen,
  onClose,
  size,
  children,
}: PropsWithChildren<ZapDrawerProps>) => {
  return (
    <Drawer
      opened={isOpen}
      onClose={onClose}
      position="bottom"
      withCloseButton={false}
      trapFocus={false}
      size={size}
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
          padding: "50px 16px !important",
        },
      })}
    >
      {children}
    </Drawer>
  );
};

export default ZapDrawer;
