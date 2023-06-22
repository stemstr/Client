import { createStyles } from "@mantine/core";

export default createStyles((theme) => {
  const hightlightStyles = {
    backgroundColor: theme.colors.purple[9],
    borderColor: theme.colors.purple[6],
  };
  const buttonStyles = {
    backgroundColor: "#202020",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.gray[7],
    borderRadius: theme.radius.lg,
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
    color: theme.colors.purple[6],
    width: 80,
    height: 80,
    padding: "0 8px",
    "&:hover": hightlightStyles,
  };

  return {
    button: buttonStyles,
    highlightedButton: { ...buttonStyles, ...hightlightStyles },
    textInput: {
      backgroundColor: theme.colors.dark[7],
      padding: theme.spacing.sm,
      borderRadius: theme.radius.md,
      border: `1px solid ${theme.colors.gray[4]}`,
      fontSize: theme.fontSizes.md,
      color: theme.white,
    },
  };
});
