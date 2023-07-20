import useStyles from "./StemstrSwitch.styles";
import { Switch } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons";

export default function StemstrSwitch({ checked, ...rest }) {
  const { classes } = useStyles();
  return (
    <Switch
      classNames={{
        root: classes.root,
        track: classes.track,
        thumb: classes.thumb,
        input: classes.input,
      }}
      thumbIcon={
        checked ? (
          <IconCheck size={16} color="#EADDFF" stroke={3} />
        ) : (
          <IconX size={16} color="#49454F" stroke={3} />
        )
      }
      checked={checked}
      {...rest}
    />
  );
}
