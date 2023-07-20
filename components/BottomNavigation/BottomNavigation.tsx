import { Footer, Group } from "@mantine/core";
import { useRouter } from "next/router";

import { Route } from "enums";

import { CompassIcon, HomeIcon, BellIcon } from "icons/StemstrIcon";
import BottomNavigationItem from "components/BottomNavigationItem/BottomNavigationItem";
import BottomNavigationMiddleItem from "./BottomNavigationMiddleItem";

import useStyles from "./BottomNavigation.styles";
import { isPwa } from "../../utils/common";

export default function BottomNavigation() {
  const { classes } = useStyles();
  const { pathname } = useRouter();
  const pwaBottomBuffer = 32;

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
      height={{
        base: isPwa() ? 64 + pwaBottomBuffer : 64,
        xs: isPwa() ? 96 + pwaBottomBuffer : 96,
      }}
      p={isPwa() ? `0 16px ${pwaBottomBuffer}px 16px` : "0 16px"}
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
