import {
  Anchor,
  Avatar,
  Box,
  Center,
  Footer,
  Group,
  Text,
} from "@mantine/core";
import Link from "next/link";
import useStyles from "./BottomNavigation.styles";
import BottomNavigationItem from "../BottomNavigationItem/BottomNavigationItem";
import { useSelector } from "react-redux";
import { selectAuthState } from "../../store/Auth";
import {
  CompassIcon,
  HomeIcon,
  ProfileIcon,
  PlusIcon,
  CollectionIcon,
} from "../../icons/StemstrIcon";

export default function BottomNavigation() {
  const { classes } = useStyles();
  const authState = useSelector(selectAuthState);

  return (
    <Footer
      height={88}
      p="md"
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
        <BottomNavigationItem href="/">
          <HomeIcon />
        </BottomNavigationItem>
        <BottomNavigationItem href="/discover">
          <CompassIcon />
        </BottomNavigationItem>
        <BottomNavigationItem>
          <Center
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background:
                "linear-gradient(142.52deg, #856BA3 9.14%, rgba(129, 36, 238, 0.76) 90.68%)",
              color: "white",
            }}
          >
            <PlusIcon />
          </Center>
        </BottomNavigationItem>
        <BottomNavigationItem href="/collections">
          <CollectionIcon width={24} height={24} />
        </BottomNavigationItem>
        <BottomNavigationItem href="/profile">
          <Avatar
            src={authState?.user?.picture}
            alt={authState?.user?.name}
            size={36}
            radius="50%"
          >
            <ProfileIcon />
          </Avatar>
        </BottomNavigationItem>
      </Group>
    </Footer>
  );
}
