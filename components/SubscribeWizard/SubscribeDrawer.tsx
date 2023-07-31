import { MantineTheme } from "@mantine/core";
import Drawer, { DrawerProps } from "components/Drawer/Drawer";
import { PropsWithChildren } from "react";
import { useSubscribeWizard } from "./SubscribeWizardProvider";

export default function SubscribeDrawer({
  children,
  ...rest
}: PropsWithChildren<DrawerProps>) {
  const { end } = useSubscribeWizard();
  return (
    <Drawer
      withCloseButton={false}
      trapFocus={true}
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
          padding: `0 16px 24px 16px !important`,
        },
      })}
      onDragEnd={end}
      {...rest}
    >
      {children}
    </Drawer>
  );
}
