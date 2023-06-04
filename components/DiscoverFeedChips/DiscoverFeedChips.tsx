import { Box, Chip } from "@mantine/core";
import useStyles from "./DiscoverFeedChips.styles";
import { NDKEvent, NDKTag } from "@nostr-dev-kit/ndk";
import { useMemo } from "react";
import { uniqBy } from "ndk/utils";

export default function DiscoverFeedChips({
  events,
  value,
  onChange,
}: {
  events: NDKEvent[];
  value: string;
  onChange: (value: string | string[]) => void;
}) {
  const { classes } = useStyles();
  const tags = useMemo<NDKTag[]>(
    () =>
      uniqBy(
        events.reduce<NDKTag[]>(
          (tags, event) => [
            ...tags,
            ...event.tags.filter((tag) => tag[0] === "t"),
          ],
          []
        ),
        1
      ),
    [events.length]
  );
  const chipNames = useMemo<string[]>(
    () => ["", ...tags.map((tag) => `${tag[1]}`)],
    [tags.length]
  );

  return (
    <Box className={classes.box}>
      <Chip.Group
        defaultValue=""
        value={value}
        onChange={onChange}
        position="left"
        className={classes.chipGroup}
      >
        {chipNames.map((chipName, index) => (
          <Chip
            key={index}
            value={chipName}
            radius="md"
            classNames={{
              root: classes.chip,
              iconWrapper: classes.iconWrapper,
              label: classes.label,
            }}
          >
            {chipName === "" ? "🔥 Latest" : `#${chipName}`}
          </Chip>
        ))}
      </Chip.Group>
    </Box>
  );
}
