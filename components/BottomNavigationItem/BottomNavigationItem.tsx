import { Anchor, Box, BoxProps, Center } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

import requireAuth from "utils/hoc/requireAuth";

import useStyles from "./BottomNavigationItem.styles";

interface BottomNavigationItemProps extends BoxProps {
  href?: string;
}

const BottomNavigationItem = ({
  children,
  href,
  ...rest
}: React.PropsWithChildren<BottomNavigationItemProps>) => {
  const { pathname } = useRouter();
  const { classes } = useStyles();

  const inner = <Center style={{ width: 36, height: 36 }}>{children}</Center>;

  return (
    <Box
      {...rest}
      className={`${classes.root} ${pathname === href ? classes.active : ""}`}
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
