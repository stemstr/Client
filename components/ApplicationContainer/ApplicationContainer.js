import { AppShell } from "@mantine/core";
import BottomNavigation from "../BottomNavigation/BottomNavigation";
import ShareSheet from "../ShareSheet/ShareSheet";

export const ApplicationContainer = ({ children }) => {
  return (
    <AppShell
      styles={{
        root: {
          width: "100%",
          maxWidth: "600px",
          height: "100vh",
          margin: "auto",
        },
        main: {
          width: "100%",
        },
      }}
      fixed
      footer={<BottomNavigation />}
    >
      {children}
      <ShareSheet />
    </AppShell>
  );
};
