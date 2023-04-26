import { Box } from "@mantine/core";
import withStopClickPropagation from "utils/hoc/withStopClickPropagation";

const NoteAction = ({ children, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={(theme) => ({
        padding: "6px 12px",
        display: "flex",
        alignItems: "center",
        fontSize: theme.fontSizes.sm,
        cursor: "pointer",
      })}
    >
      {children}
    </Box>
  );
};

export default withStopClickPropagation(NoteAction);
