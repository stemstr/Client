import { Anchor, Box, Group } from "@mantine/core";
import { RemixIcon } from "../../icons/StemstrIcon";
import useStyles from "components/DownloadSoundButton/DownloadSoundButton.styles";

export default function DownloadSoundButton({ href }) {
  const { classes } = useStyles();

  const buttonElement = href && (
    <Box className={classes.root}>
      <Box className={classes.gradientBorder}></Box>
      <Group spacing={5} className={classes.inner}>
        Remix
        <RemixIcon width={16} height={16} />
      </Group>
    </Box>
  );

  return (
    <Anchor href={href} download>
      {buttonElement}
    </Anchor>
  );
}
