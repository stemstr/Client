import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  tab: {
    paddingTop: 14,
    paddingBottom: 14,
    "&:hover": {
      backgroundColor: "unset",
      color: theme.colors.purple[5],
    },
    "&[data-active]": {
      color: theme.colors.purple[5],
      border: "none",
      [`.${getRef("tabLabel")}`]: {
        fontWeight: "bold",
        "::after": {
          content: '""',
          height: 3,
          borderTopLeftRadius: 4,
          position: "absolute",
          bottom: -15,
          left: 0,
          right: 0,
          backgroundColor: theme.colors.purple[5],
        },
      },
      [`.${getRef("tabRightSection")}`]: {
        "::after": {
          content: '""',
          height: 3,
          borderTopRightRadius: 4,
          position: "absolute",
          bottom: -13,
          left: -8,
          right: 0,
          backgroundColor: theme.colors.purple[5],
        },
      },
      [`.${getRef("count")}`]: {
        backgroundColor: theme.colors.purple[5],
      },
    },
  },
  tabLabel: {
    ref: getRef("tabLabel"),
    position: "relative",
  },
  tabRightSection: {
    ref: getRef("tabRightSection"),
    position: "relative",
  },
  count: {
    ref: getRef("count"),
    backgroundColor: theme.colors.gray[4],
    color: theme.white,
    padding: "4px 6px",
    fontSize: 10,
  },
}));

export default useStyles;
