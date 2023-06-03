import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  box: {
    overflowX: "scroll",
    "::-webkit-scrollbar": {
      display: "none",
    },
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    position: "sticky",
    top: 0,
    backgroundColor: theme.colors.dark[7],
    zIndex: 1,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
  chipGroup: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    width: "max-content",
  },
  chip: {
    // paddingTop: 4,
    // paddingBottom: 4,
  },
  iconWrapper: {
    display: "none",
  },
  label: {
    height: 36,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingTop: 4,
    paddingBottom: 4,
    "&[data-variant=outline]": {
      backgroundColor: "rgba(255, 255, 255, 0.06)",
    },
    "&[data-checked]": {
      paddingLeft: theme.spacing.md,
      paddingRight: theme.spacing.md,
      "&[data-variant=outline]": {
        backgroundColor: "rgba(255, 255, 255, 0.16)",
      },
    },
  },
}));

export default useStyles;
