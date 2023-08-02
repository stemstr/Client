import { Footer, Group } from "@mantine/core";
import { useRouter } from "next/router";

import { Route } from "enums";

import { CompassIcon, HomeIcon, BellIcon } from "icons/StemstrIcon";
import BottomNavigationItem from "components/BottomNavigationItem/BottomNavigationItem";
import BottomNavigationMiddleItem from "./BottomNavigationMiddleItem";

import useStyles from "./BottomNavigation.styles";
import { hasNotch, isPwa } from "../../utils/common";
import useFooterHeight from "../../ndk/hooks/useFooterHeight";
import { PWA_BOTTOM_BUFFER } from "../../constants/styles";

export default function BottomNavigation() {
  const { classes } = useStyles();
  const { pathname } = useRouter();
  const footerHeight = useFooterHeight();

  if (
    [
      Route.Login,
      Route.Signup,
      Route.EditProfile,
      Route.Contacts,
      Route.Thread,
    ].includes(pathname as Route)
  )
    return null;

  return (
    <Footer
      height={footerHeight}
      p={
        isPwa() && hasNotch() ? `0 16px ${PWA_BOTTOM_BUFFER}px 16px` : "0 16px"
      }
      styles={{
        root: {
          width: "100%",
          left: "0",
          right: "0",
        },
      }}
      className={classes.footer}
    >
      <Group
        // position="apart"
        align="center"
        spacing="xl"
        className={classes.group}
        maw={600}
        mx="auto"
        sx={{ justifyContent: "space-around" }}
      >
        {/* <BottomNavigationItem href={Route.Home} requiresAuth>
          <HomeIcon width={32} height={32} />
        </BottomNavigationItem> */}
        <BottomNavigationItem href={Route.Discover}>
          <CompassIcon width={32} height={32} />
        </BottomNavigationItem>
        <BottomNavigationMiddleItem />
        {/* <BottomNavigationItem /> */}
        <BottomNavigationItem href={Route.Notifications} requiresAuth>
          <BellIcon width={32} height={32} />
        </BottomNavigationItem>
      </Group>
    </Footer>
  );
}
