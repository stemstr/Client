import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  player: {
    height: 120,
    borderRadius: theme.radius.lg,
    background:
      "linear-gradient(180deg, rgba(44, 44, 44, 0) 0%, rgba(134, 90, 226, 0.4) 100%);",
    border: `1px solid rgba(187, 134, 252, 0.4)`,
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
