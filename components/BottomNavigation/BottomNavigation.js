import { Avatar, Box, Center, Footer, Group, Text } from "@mantine/core";
import Link from "next/link";
import useStyles from "./BottomNavigation.styles";
import BottomNavigationItem from "../BottomNavigationItem/BottomNavigationItem";
import { useSelector } from "react-redux";
import { selectAuthState } from "../../store/Auth";

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
        <BottomNavigationItem>
          <Link href="/">
            <Text size={24}>🏠</Text>
          </Link>
        </BottomNavigationItem>
        <BottomNavigationItem>
          <Link href="/discover">
            <Text size={24}>🔍</Text>
          </Link>
        </BottomNavigationItem>
        <BottomNavigationItem>
          <Center
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              backgroundColor: "white",
            }}
          >
            <Text size={24}>➕</Text>
          </Center>
        </BottomNavigationItem>
        <BottomNavigationItem>
          <Link href="/collections">
            <Text size={24}>📚</Text>
          </Link>
        </BottomNavigationItem>
        <BottomNavigationItem>
          <Link href="/profile">
            <Avatar
              src={authState?.user?.picture}
              alt={authState?.user?.name}
              size={36}
              radius="50%"
            ></Avatar>
          </Link>
        </BottomNavigationItem>
      </Group>
    </Footer>
  );
}
