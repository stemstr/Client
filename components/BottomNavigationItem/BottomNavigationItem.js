import { Anchor, Box, Center } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import useStyles from "./BottomNavigationItem.styles";
import requireAuth from "../../utils/hoc/requireAuth";

const BottomNavigationItem = ({ children, href, ...rest }) => {
  const router = useRouter();
  const { classes } = useStyles();
  const inner = <Center style={{ width: 36, height: 36 }}>{children}</Center>;

  return (
    <Box
      {...rest}
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
};

const AuthBottomNavigationItem = requireAuth(BottomNavigationItem);

export { AuthBottomNavigationItem, BottomNavigationItem };
export default BottomNavigationItem;
