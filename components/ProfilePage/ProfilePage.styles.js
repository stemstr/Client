import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  profileActionButtons: {
    marginTop: theme.spacing.xs,
    [theme.fn.largerThan("xs")]: {
      marginTop: theme.spacing.md,
    },
  },
}));

export default useStyles;
