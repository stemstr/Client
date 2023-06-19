import { Box, Chip } from "@mantine/core";
import useStyles from "./DiscoverFeedChips.styles";
import { useEffect, useState } from "react";
import { NDKEvent } from "@nostr-dev-kit/ndk";

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
  const [chipLabels, setChipLabels] = useState<string[]>([]);
  const chipLabelsHash = chipLabels.join();

  useEffect(() => {
    const tagNames: string[] = [];

    events.forEach(({ tags }) => {
      tags.forEach((tag) => {
        if (tag[0] === "t") {
          tagNames.push(tag[1]);
        }
      });
    });

    setChipLabels(Array.from(new Set([...chipLabels, ...tagNames])));
  }, [events, chipLabelsHash]);

  return (
    <Box className={classes.box}>
      <Chip.Group
        defaultValue=""
        value={value}
        onChange={onChange}
        position="left"
        className={classes.chipGroup}
      >
        {["🔥 Latest", ...chipLabels].map((chipName, index) => (
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
