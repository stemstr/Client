import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  anchor: {
    color: theme.colors.purple[4],
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

export default useStyles;
