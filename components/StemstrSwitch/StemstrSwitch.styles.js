import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  root: {},
  track: {
    ref: getRef("track"),
    width: 52,
    height: 32,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: theme.colors.dark[2],
    backgroundColor: "#49454F",
    cursor: "pointer",
  },
  thumb: {
    ref: getRef("thumb"),
    width: 24,
    height: 24,
    backgroundColor: theme.colors.dark[2],
    borderColor: theme.colors.dark[2],
  },
  input: {
    "&:checked": {
      "&+*": {
        [`&>.${getRef("thumb")}`]: {
          backgroundColor: "#381E72",
          borderColor: "#381E72",
          left: "calc(100% - 24px - 2px)",
        },
      },
      [`&+.${getRef("track")}`]: {
        backgroundColor: "#D0BCFF",
        borderColor: "#D0BCFF",
      },
    },
  },
}));

export default useStyles;
