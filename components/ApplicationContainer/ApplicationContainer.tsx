import { AppShell } from "@mantine/core";
import { useRouter } from "next/router";

import BottomNavigation from "../BottomNavigation/BottomNavigation";
import PostSheet from "../PostSheet/PostSheet";
import FileDropOverlay from "../FileDropOverlay/FileDropOverlay";
import { Route } from "enums/routes";

export const ApplicationContainer = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const router = useRouter();

  return (
    <AppShell
      padding={0}
      styles={{
        root: {
          width: "100%",
          maxWidth: router.pathname === Route.Home ? "100%" : 600,
          height: "100vh",
          margin: "auto",
        },
        main: {
          width: "100%",
          height: "100vh",
        },
      }}
      fixed
      footer={<BottomNavigation />}
    >
      {children}
      <PostSheet />
      <FileDropOverlay />
    </AppShell>
  );
};
