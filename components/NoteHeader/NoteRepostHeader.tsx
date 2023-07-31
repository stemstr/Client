import { Group, Text } from "@mantine/core";
import { RepostIcon } from "icons/StemstrIcon";
import { useEvent } from "ndk/NDKEventProvider";
import { getFormattedName } from "ndk/utils";

export default function NoteRepostHeader() {
  const { repostedBy } = useEvent();

  return (
    <Group spacing={0} c="white" fz="sm" lh="normal">
      <RepostIcon />
      <Text ml={8} fw="bold" span>
        {getFormattedName(repostedBy)}
      </Text>
      <Text c="gray.3" span>
        &nbsp;reposted
      </Text>
    </Group>
  );
}
