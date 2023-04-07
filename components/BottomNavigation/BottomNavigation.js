import { Avatar, Center, Footer, Group, Text } from "@mantine/core";
import useStyles from "./BottomNavigation.styles";
import BottomNavigationItem from "../BottomNavigationItem/BottomNavigationItem";
import { selectAuthState } from "../../store/Auth";
import {
  CompassIcon,
  HomeIcon,
  ProfileIcon,
  PlusIcon,
  CollectionIcon,
  BellIcon,
} from "../../icons/StemstrIcon";
import { useDispatch, useSelector } from "react-redux";
import { openSheet } from "../../store/Sheets";

export default function BottomNavigation() {
  const { classes } = useStyles();
  const authState = useSelector(selectAuthState);
  const dispatch = useDispatch();

  const openPostSheet = () => {
    dispatch(openSheet("postSheet"));
  };

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
        <BottomNavigationItem />
        <BottomNavigationItem />
        <BottomNavigationItem>
          <Center
            onClick={openPostSheet}
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background:
                "linear-gradient(142.52deg, #856BA3 9.14%, rgba(129, 36, 238, 0.76) 90.68%)",
              color: "white",
              cursor: "pointer",
            }}
          >
            <PlusIcon />
          </Center>
        </BottomNavigationItem>
        <BottomNavigationItem />
        <BottomNavigationItem />
      </Group>
    </Footer>
  );
}
