import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  box: {
    backgroundColor: theme.colors.dark[8],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.gray[4],
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    transition: "background-color .5s ease",
    "&:hover": {
      backgroundColor: theme.colors.dark[7],
      [`.${getRef("tag")}`]: {
        label: {
          // backgroundColor: theme.fn.rgba(theme.white, 0.06),
        },
      },
    },
  },
  tag: {
    ref: getRef("tag"),
    transition: "background-color .5s ease",
  },
  player: {
    backgroundColor: theme.colors.dark[7],
    height: 120,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(187, 134, 252, 0.38)",
    borderRadius: theme.radius.lg,
  },
}));

export default useStyles;
