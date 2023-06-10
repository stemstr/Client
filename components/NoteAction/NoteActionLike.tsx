import { useEffect, useState } from "react";
import { Group, Text } from "@mantine/core";
import { motion, useAnimation } from "framer-motion";
import { useSelector } from "react-redux";
import { Kind } from "nostr-tools";
import { HeartIcon } from "../../icons/StemstrIcon";
import requireAuth from "../../utils/hoc/requireAuth";
import NoteAction from "./NoteAction";
import { selectAuthState } from "store/Auth";
import { formatETag, parseEventTags } from "../../ndk/utils";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useNDK } from "../../ndk/NDKProvider";
import { useEvent } from "../../ndk/NDKEventProvider";
import { useNoteReactions } from "../../ndk/hooks/useNoteReactions";

const NoteActionLike = () => {
  const { ndk } = useNDK();
  const { event } = useEvent();
  const reactions = useNoteReactions();
  const controls = useAnimation();
  const auth = useSelector(selectAuthState);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);
  const handleClickLike = () => {
    let created_at = Math.floor(Date.now() / 1000);
    const { root, mentions, reply } = parseEventTags(event);

    let eTags = [];
    if (root) eTags.push(root);
    eTags.push(...mentions);
    eTags.push(formatETag(["e", event.id], "reply"));
    if (reply) eTags.push(formatETag(reply, "mention"));

    let pTags = event.tags.filter((t) => t[0] === "p");
    pTags.push(["p", event.pubkey]);

    let tags = [...eTags, ...pTags];

    const reactionEvent = new NDKEvent(ndk);
    reactionEvent.kind = Kind.Reaction;
    reactionEvent.created_at = created_at;
    reactionEvent.tags = tags;
    reactionEvent.content = "❤️";
    reactionEvent
      .publish()
      .then(() => {
        setLikedByCurrentUser(true);
        controls.start({
          scale: [1, 1.25, 1],
          transition: {
            duration: 0.5,
            ease: "easeInOut",
          },
        });
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (!likedByCurrentUser) {
      if (reactions.find((ev) => ev.pubkey === auth.pk)) {
        setLikedByCurrentUser(true);
      }
    }
  }, [reactions.length, auth.pk]);

  return (
    <NoteAction onClick={handleClickLike}>
      <Group
        position="center"
        spacing={6}
        sx={(theme) => ({
          transition: "color 1s ease",
          color: likedByCurrentUser
            ? theme.colors.red[5]
            : theme.colors.gray[1],
        })}
      >
        <motion.span animate={controls} style={{ lineHeight: 0 }}>
          <HeartIcon width={18} height={18} />
        </motion.span>{" "}
        <Text lh="normal">
          {reactions.length > 0 && event.pubkey === auth.pk
            ? reactions.length
            : ""}
        </Text>
      </Group>
    </NoteAction>
  );
};

export default requireAuth(NoteActionLike);
