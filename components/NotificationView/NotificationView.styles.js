import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
  notification: {
    backgroundColor: theme.colors.dark[8],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.gray[4],
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    transition: "background-color .5s ease",
    "&:hover": {
      [theme.fn.largerThan("xs")]: {
        backgroundColor: theme.colors.dark[7],
      },
    },
  },
  kindIcon: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.xl,
  },
  kindIconReaction: {
    backgroundColor: theme.colors.red[9],
    color: theme.colors.red[5],
  },
  kindIconRepost: {
    backgroundColor: theme.colors.green[9],
    color: theme.colors.green[5],
  },
  kindIconZap: {
    backgroundColor: theme.colors.orange[9],
    color: theme.colors.orange[5],
  },
}));

export default useStyles;
