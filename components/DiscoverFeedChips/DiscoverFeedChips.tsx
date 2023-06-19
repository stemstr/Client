import { Box, Chip } from "@mantine/core";
import useStyles from "./DiscoverFeedChips.styles";

export default function DiscoverFeedChips({
  labels,
  value,
  onChange,
}: {
  labels: string[];
  value: string;
  onChange: (value: string | string[]) => void;
}) {
  const { classes } = useStyles();

  return (
    <Box className={classes.box}>
      <Chip.Group
        defaultValue=""
        value={value}
        onChange={onChange}
        position="left"
        className={classes.chipGroup}
      >
        {["🔥 Latest", ...labels].map((chipName, index) => (
          <Chip
            key={index}
            value={index === 0 ? "" : chipName}
            radius="md"
            classNames={{
              root: classes.chip,
              iconWrapper: classes.iconWrapper,
              label: classes.label,
            }}
          >
            {index === 0 ? chipName : `#${chipName}`}
          </Chip>
        ))}
      </Chip.Group>
    </Box>
  );
}
