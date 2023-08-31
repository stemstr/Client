import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  overlay: {
    backgroundColor: `${theme.colors.dark[7]} !important`,
    backdropFilter: "blur(16px)",
    opacity: `${0.5} !important`,
  },
  drawer: {
    backgroundColor: theme.colors.dark[8],
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    maxWidth: 600,
    margin: "auto",
    padding: `0 16px 24px 16px !important`,
  },
}));

export default useStyles;
