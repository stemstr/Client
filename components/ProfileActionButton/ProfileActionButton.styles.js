import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  root: {
    height: 32,
    padding: "8px 16px",
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.gray[4],
    backgroundColor: theme.colors.gray[6],
    color: theme.white,
    cursor: "pointer",
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    lineHeight: "normal",
  },
}));

export default useStyles;
