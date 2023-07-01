import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  profileActionButtons: {
    marginTop: theme.spacing.xs,
    [theme.fn.largerThan("xs")]: {
      marginTop: theme.spacing.md,
    },
  },
  contactsBar: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderStyle: "solid",
    borderColor: theme.fn.rgba(theme.colors.gray[0], 0.1),
    fontSize: 14,
    color: theme.white,
    [theme.fn.largerThan("sm")]: {
      marginLeft: -theme.spacing.md,
      marginRight: -theme.spacing.md,
    },
  },
  followButton: {
    backgroundColor: theme.colors.purple[5],
    borderColor: theme.colors.purple[5],
  },
  followButtonDisabled: {
    backgroundColor: theme.colors.gray[6],
    borderColor: theme.colors.gray[5],
    cursor: "default",
  },
}));

export default useStyles;
