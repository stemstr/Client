import { Text } from "@mantine/core";
import { Group } from "@mantine/core";
import { CommentIcon, VerifiedIcon } from "icons/StemstrIcon";
import { useEvent } from "ndk/NDKEventProvider";
import useNip05 from "ndk/hooks/useNip05";
import { useUser } from "ndk/hooks/useUser";
import { useMemo } from "react";
import { Nip05Status } from "store/Nip05";

export default function NoteReplyingToHeader() {
  const { event } = useEvent();
  const replyingToPubkey = useMemo(() => {
    if (!event.tags.some((tag) => tag[0] === "e")) return;
    const replyingToTag = event.tags.find((tag) => tag[0] === "p");
    if (!replyingToTag) return;
    return replyingToTag[1];
  }, [event]);
  const user = useUser(event.pubkey);
  const replyingTo = useUser(replyingToPubkey);

  return replyingToPubkey ? (
    <Group spacing={0} c="white" fz="sm" lh="normal">
      <CommentIcon width={16} height={16} />
      <Text ml={8} fw="bold" span>
        @{user?.profile?.name}
      </Text>
      <Text c="gray.3" span>
        &nbsp;remixed
      </Text>
      <Text fw="bold" span>
        &nbsp;@{replyingTo?.profile?.name}
      </Text>
    </Group>
  ) : null;
}
