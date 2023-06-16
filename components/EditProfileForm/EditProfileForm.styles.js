import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  textInput: {
    backgroundColor: theme.colors.dark[7],
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.gray[4]}`,
    fontSize: theme.fontSizes.md,
    color: theme.white,
  },
}));

export default useStyles;
