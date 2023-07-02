import { Footer, Group } from "@mantine/core";
import { useRouter } from "next/router";

import { Route } from "enums";

import { CompassIcon, HomeIcon, BellIcon } from "icons/StemstrIcon";
import BottomNavigationItem from "components/BottomNavigationItem/BottomNavigationItem";
import BottomNavigationMiddleItem from "./BottomNavigationMiddleItem";

import useStyles from "./BottomNavigation.styles";

export default function BottomNavigation() {
  const { classes } = useStyles();
  const { pathname } = useRouter();

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
        base: 64,
        xs: 96,
      }}
      p="0 16px"
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
        position="apart"
        align="center"
        spacing="xl"
        className={classes.group}
        maw={600}
        mx="auto"
      >
        <BottomNavigationItem href={Route.Home} requiresAuth>
          <HomeIcon />
        </BottomNavigationItem>
        <BottomNavigationItem href={Route.Discover}>
          <CompassIcon />
        </BottomNavigationItem>
        <BottomNavigationMiddleItem />
        <BottomNavigationItem />
        <BottomNavigationItem href={Route.Notifications} requiresAuth>
          <BellIcon />
        </BottomNavigationItem>
      </Group>
    </Footer>
  );
}
