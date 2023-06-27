import { createStyles } from "@mantine/core";

export default createStyles((theme) => {
  const hightlightStyles = {
    backgroundColor: theme.colors.purple[9],
    borderColor: theme.colors.purple[6],
  };
  const subtleStyles = {
    color: theme.colors.purple[6],
    width: 80,
    height: 80,
    padding: "0 2px",
  };
  const buttonStyles = {
    backgroundColor: "#202020",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.gray[7],
    borderRadius: theme.radius.lg,
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
    "@media (hover: hover)": {
      "&:hover": hightlightStyles,
    },
    "&:active": hightlightStyles,
    ...subtleStyles,
  };

  return {
    button: buttonStyles,
    highlightedButton: { ...buttonStyles, ...hightlightStyles },
    subtleButton: subtleStyles,
  };
});
