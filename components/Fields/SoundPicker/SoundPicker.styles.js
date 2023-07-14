import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  pickerBorder: {
    borderRadius: 8,
  },
  pickerBackdrop: {
    borderRadius: 8,
    backgroundColor: theme.colors.dark[8],
  },
  picker: {
    padding: "14px 16px",
    borderRadius: 8,
    height: 96,
    transition: "gap .5s ease",
  },
}));

export default useStyles;
