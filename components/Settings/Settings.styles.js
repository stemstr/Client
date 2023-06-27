import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  settingsItem: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.gray[4],
    padding: theme.spacing.md,
    borderRadius: 12,
    width: "100%",
  },
}));

export default useStyles;
