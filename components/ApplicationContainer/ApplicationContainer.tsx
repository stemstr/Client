import { AppShell } from "@mantine/core";
import { useRouter } from "next/router";

import BottomNavigation from "../BottomNavigation/BottomNavigation";
import PostSheet from "../PostSheet/PostSheet";
import FileDropOverlay from "../FileDropOverlay/FileDropOverlay";
import { Route } from "enums/routes";
import useLoadUserPreferences from "../../hooks/useLoadUserPreferences";
import { SubscribeWizard } from "components/SubscribeWizard/SubscribeWizard";
import useSubscriptionStatus from "hooks/useSubscriptionStatus";

export const ApplicationContainer = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const router = useRouter();

  useLoadUserPreferences();
  useSubscriptionStatus();

  return (
    <AppShell
      padding={0}
      styles={{
        root: {
          width: "100%",
          maxWidth: [Route.Home, Route.Discover].includes(
            router.pathname as Route
          )
            ? "100%"
            : 600,
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
      <SubscribeWizard />
      <FileDropOverlay />
    </AppShell>
  );
};
