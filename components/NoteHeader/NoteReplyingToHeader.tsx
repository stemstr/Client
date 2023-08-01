import { Text } from "@mantine/core";
import { Group } from "@mantine/core";
import { CommentIcon, RemixIcon } from "icons/StemstrIcon";
import { useEvent } from "ndk/NDKEventProvider";
import { useUser } from "ndk/hooks/useUser";
import { getFormattedName } from "ndk/utils";
import { useMemo } from "react";

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
  const verb = event.kind === 1808 ? "remixed" : "replied to";
  const Icon = event.kind === 1808 ? RemixIcon : CommentIcon;

  return replyingToPubkey ? (
    <Group spacing={0} c="white" fz="sm" lh="normal">
      <Icon width={16} height={16} />
      <Text ml={8} fw="bold" span>
        {getFormattedName(user)}
      </Text>
      <Text c="gray.3" span>
        &nbsp;{verb}
      </Text>
      <Text fw="bold" span>
        &nbsp;{getFormattedName(replyingTo)}
      </Text>
    </Group>
  ) : null;
}
