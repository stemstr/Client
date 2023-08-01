import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  root: {
    position: "relative",
    borderRadius: 32,
    background: theme.colors.gray[4],
    transition: "all 0.3s",
    padding: 1,
    "&:hover": {
      [`.${getRef("inner")}`]: {
        background: "rgb(17, 29, 26)",
      },
      [`.${getRef("gradientBorder")}`]: {
        opacity: 1,
      },
    },
  },
  gradientBorder: {
    ref: getRef("gradientBorder"),
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 32,
    background:
      "linear-gradient(90deg, rgba(9, 212, 176, 1), rgba(139, 246, 227, 0.23))",
    opacity: 0,
    transition: "all 0.3s",
  },
  inner: {
    ref: getRef("inner"),
    position: "relative",
    backgroundColor: theme.colors.gray[6],
    borderRadius: 32,
    color: theme.colors.green[2],
    padding: "4px 6px",
    cursor: "pointer",
    transition: "all 0.3s",
    fontSize: theme.fontSizes.xs,
    lineHeight: 1.4,
  },
}));

export default useStyles;
