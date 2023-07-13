import { useState } from "react";
import { Group, Text } from "@mantine/core";
import { motion, useAnimation } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Kind } from "nostr-tools";
import { HeartIcon } from "../../icons/StemstrIcon";
import NoteAction from "./NoteAction";
import { formatETag, parseEventTags } from "../../ndk/utils";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useNDK } from "../../ndk/NDKProvider";
import { useEvent } from "../../ndk/NDKEventProvider";
import useAuth from "hooks/useAuth";
import { currentUserLikedNote, selectNoteState } from "../../store/Notes";
import { AppState } from "../../store/Store";

const NoteActionLike = () => {
  const dispatch = useDispatch();
  const { ndk } = useNDK();
  const { event } = useEvent();
  const noteId = event.id;
  const { guardAuth } = useAuth();
  const controls = useAnimation();
  const { isLikedByCurrentUser, reactionCount } = useSelector(
    (state: AppState) => selectNoteState(state, noteId)
  );
  const [isProcessingLike, setIsProcessingLike] = useState(false);

  const handleClickLike = () => {
    if (!guardAuth() || isLikedByCurrentUser || isProcessingLike) return;

    setIsProcessingLike(true);

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
        dispatch(currentUserLikedNote(noteId));
        controls.start({
          scale: [1, 1.25, 1],
          transition: {
            duration: 0.5,
            ease: "easeInOut",
          },
        });
      })
      .catch(console.error)
      .finally(() => setIsProcessingLike(false));
  };

  return (
    <NoteAction onClick={handleClickLike}>
      <Group
        position="center"
        spacing={6}
        sx={(theme) => ({
          transition: "color 1s ease",
          color: isLikedByCurrentUser
            ? theme.colors.red[5]
            : theme.colors.gray[1],
        })}
        noWrap
      >
        <motion.span animate={controls} style={{ lineHeight: 0 }}>
          <HeartIcon width={18} height={18} />
        </motion.span>{" "}
        {reactionCount > 0 && <Text lh="normal">{reactionCount}</Text>}
      </Group>
    </NoteAction>
  );
};

export default NoteActionLike;
