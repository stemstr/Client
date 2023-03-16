import { Anchor, Box, Center } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import useStyles from "./BottomNavigationItem.styles";

export default function BottomNavigationItem({ children, href }) {
  const router = useRouter();
  const { classes } = useStyles();
  const inner = <Center style={{ width: 36, height: 36 }}>{children}</Center>;

  return (
    <Box
      className={`${classes.root} ${
        router.pathname === href ? classes.active : ""
      }`}
    >
      {href ? (
        <Anchor component={Link} c="gray.2" href={href}>
          {inner}
        </Anchor>
      ) : (
        inner
      )}
    </Box>
  );
}
