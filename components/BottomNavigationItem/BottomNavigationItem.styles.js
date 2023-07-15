import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  root: {
    position: "relative",
  },
  active: {
    svg: {
      color: "white",
    },
  },
  hasNotifications: {
    "&::after": {
      content: '""',
      display: "block",
      position: "absolute",
      left: "calc(50% - 4px)",
      width: 8,
      height: 8,
      borderRadius: theme.radius.xl,
      background:
        "linear-gradient(180deg, rgba(170, 214, 255, 0) 15.36%, #0FF1FF 100%);",
    },
  },
}));

export default useStyles;
