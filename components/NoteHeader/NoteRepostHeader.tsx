import { Group, Text } from "@mantine/core";
import { RepostIcon, VerifiedIcon } from "icons/StemstrIcon";
import { useEvent } from "ndk/NDKEventProvider";
import useNip05 from "ndk/hooks/useNip05";
import { getFormattedName } from "ndk/utils";
import { Nip05Status } from "store/Nip05";

export default function NoteRepostHeader() {
  const { repostedBy } = useEvent();
  const repostedByNip05Status = useNip05(
    repostedBy?.hexpubkey(),
    repostedBy?.profile?.nip05
  );

  return (
    <Group spacing={0} c="white" fz="sm" lh="normal">
      <RepostIcon />
      <Text ml={8} fw="bold" span>
        {getFormattedName(repostedBy)}
      </Text>
      {repostedByNip05Status === Nip05Status.Valid && (
        <>
          &nbsp;
          <VerifiedIcon width={14} height={14} />
        </>
      )}
      <Text c="gray.3" span>
        &nbsp;reposted
      </Text>
    </Group>
  );
}
