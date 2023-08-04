import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  feed: {
    "*": {
      msOverflowStyle: "none",
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
  },
}));

export default useStyles;
