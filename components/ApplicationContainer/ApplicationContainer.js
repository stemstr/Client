import { AppShell } from "@mantine/core";
import BottomNavigation from "../BottomNavigation/BottomNavigation";
import PostSheet from "../PostSheet/PostSheet";

export const ApplicationContainer = ({ children }) => {
  return (
    <AppShell
      // padding={0}
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
      <PostSheet />
    </AppShell>
  );
};
