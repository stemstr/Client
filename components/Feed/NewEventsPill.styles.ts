import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  newEventsPill: {
    position: "absolute",
    top: -20,
    left: "calc(50% - 130px)",
    width: 260,
    height: 50,
    padding: "6px 24px",
    cursor: "pointer",
    borderRadius: 100,
    background: theme.colors.purple[7],
    boxShadow: "0 0 15px rgba(78,0,255,.6)",
    color: "white",
    opacity: 0.9,
    zIndex: 2,
    gap: 8,
  },
}));

export default useStyles;
