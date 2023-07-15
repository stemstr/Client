import { Anchor, Box, BoxProps, Center } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

import useStyles from "./BottomNavigationItem.styles";
import useAuth from "hooks/useAuth";
import { useMemo } from "react";
import { Route } from "enums";

interface BottomNavigationItemProps extends BoxProps {
  href?: string;
  middleButton?: boolean;
  requiresAuth?: boolean;
}

const BottomNavigationItem = ({
  children,
  middleButton = false,
  href,
  requiresAuth = false,
  ...rest
}: React.PropsWithChildren<BottomNavigationItemProps>) => {
  const { pathname } = useRouter();
  const { classes } = useStyles();
  const { guardAuth, isAuthenticated } = useAuth();
  const linkTo = useMemo(() => {
    if (!href) return;
    return requiresAuth && !isAuthenticated ? Route.Login : href;
  }, [href, requiresAuth, isAuthenticated]);

  const inner = (
    <Center
      sx={(theme) => ({
        width: 32,
        height: 32,
        [`${theme.fn.largerThan("xs")}`]: {
          width: middleButton ? 66 : 32,
          height: middleButton ? 66 : 32,
        },
      })}
    >
      {children}
    </Center>
  );

  return (
    <Box
      {...rest}
      className={`${classes.root} ${pathname === href ? classes.active : ""} ${
        href === Route.Notifications && classes.hasNotifications
      }`}
    >
      {linkTo ? (
        <Anchor component={Link} c="gray.2" href={linkTo}>
          {inner}
        </Anchor>
      ) : (
        inner
      )}
    </Box>
  );
};

export default BottomNavigationItem;
