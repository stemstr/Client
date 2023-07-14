import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  playerBorder: {
    borderRadius: theme.radius.lg,
    background:
      "linear-gradient(180deg, rgba(187, 134, 252, 0.4), rgba(151, 71, 255, 1));",
  },
  playerBackdrop: {
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.dark[8],
  },
  player: {
    height: 120,
    borderRadius: theme.radius.lg,
    background:
      "linear-gradient(180deg, rgba(44, 44, 44, 0.00) 50%, rgba(134, 90, 226, 0.40) 100%);",
  },
  playerSection: {
    padding: "14px 16px",
    flexGrow: 1,
    height: "100%",
  },
  dragHandle: {
    textDecoration: "none!important",
    height: "100%",
    opacity: 0,
    width: 0,
    transition: "all .3s cubic-bezier(0.215, 0.61, 0.355, 1)",
    cursor: "grab",
  },
  dragHandleReady: {
    padding: "14px 6px 14px 0",
    borderLeft: `1px solid rgba(187, 134, 252, 0.4)`,
    opacity: 1,
    width: 48,
  },
}));

export default useStyles;
