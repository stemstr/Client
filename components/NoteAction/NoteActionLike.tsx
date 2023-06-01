import { Group, Text } from "@mantine/core";
import { motion, useAnimation } from "framer-motion";
import { formatETag, parseEventTags } from "ndk/utils";
import { useNDK } from "ndk/NDKProvider";
import { Kind } from "nostr-tools";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HeartIcon } from "../../icons/StemstrIcon";
import requireAuth from "../../utils/hoc/requireAuth";
import NoteAction from "./NoteAction";
import { Note } from "ndk/types/note";
import { selectAuthState } from "store/Auth";
import { NDKEvent, NDKTag } from "@nostr-dev-kit/ndk";

const NoteActionLike = ({ note }: { note: Note }) => {
  const { ndk } = useNDK();
  const controls = useAnimation();
  const auth = useSelector(selectAuthState);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);

  useEffect(() => {
    if (!likedByCurrentUser) {
      if (note.reactions.find((ev) => ev.pubkey === auth.pk)) {
        setLikedByCurrentUser(true);
      }
    }
  }, [note.reactions.length, auth.pk]);

  const handleClick = () => {
    let created_at = Math.floor(Date.now() / 1000);
    const { root, mentions, reply } = parseEventTags(note.event);

    let eTags: NDKTag[] = [];
    if (root) eTags.push(root);
    eTags.push(...mentions);
    eTags.push(formatETag(["e", note.event.id], "reply"));
    if (reply) eTags.push(formatETag(reply, "mention"));

    let pTags = note.event.tags.filter((t) => t[0] === "p");
    pTags.push(["p", note.event.pubkey]);

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
      .catch((err) => {});
  };

  return (
    <NoteAction onClick={handleClick}>
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
          {note.reactions.length > 0 && note.event.pubkey === auth.pk
            ? note.reactions.length
            : ""}
        </Text>
      </Group>
    </NoteAction>
  );
};

export default requireAuth(NoteActionLike);
