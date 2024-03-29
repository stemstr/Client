import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  followButton: {
    backgroundColor: theme.colors.purple[5],
    borderColor: theme.colors.purple[5],
    "&:disabled": {
      backgroundColor: theme.colors.gray[6],
      borderColor: theme.colors.gray[5],
      cursor: "default",
    },
  },
  followButtonDisabled: {
    backgroundColor: theme.colors.gray[6],
    borderColor: theme.colors.gray[5],
    cursor: "default",
  },
  unfollowButton: {
    backgroundColor: theme.colors.gray[6],
    borderColor: theme.colors.gray[6],
  },
}));

export default useStyles;
