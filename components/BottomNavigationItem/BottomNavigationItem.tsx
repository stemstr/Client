import { Anchor, Box, BoxProps, Center } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

import requireAuth from "utils/hoc/requireAuth";

import useStyles from "./BottomNavigationItem.styles";

interface BottomNavigationItemProps extends BoxProps {
  href?: string;
  middleButton?: boolean;
}

const BottomNavigationItem = ({
  children,
  middleButton = false,
  href,
  ...rest
}: React.PropsWithChildren<BottomNavigationItemProps>) => {
  const { pathname } = useRouter();
  const { classes } = useStyles();

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
