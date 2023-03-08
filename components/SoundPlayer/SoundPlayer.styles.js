import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  player: {
    height: 120,
    borderRadius: theme.radius.lg,
    background:
      "linear-gradient(180deg, rgba(44, 44, 44, 0) 0%, rgba(134, 90, 226, 0.4) 100%);",
    padding: "14px 16px",
    border: `1px solid rgba(187, 134, 252, 0.4)`,
  },
}));

export default useStyles;
