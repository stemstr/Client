import { Box, Group, Stack, Text } from "@mantine/core";
import { Kind } from "nostr-tools";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommentIcon, ShakaIcon, ZapIcon } from "../../icons/StemstrIcon";
import { useProfile } from "../../ndk/hooks/useProfile";
import NoteTags from "../NoteTags/NoteTags";
import NoteHeader from "../NoteHeader/NoteHeader";
import NoteAction from "../NoteAction/NoteAction";
import NoteActionComment from "../NoteAction/NoteActionComment";
import NoteActionLike from "../NoteAction/NoteActionLike";
import SoundPlayer from "../SoundPlayer/SoundPlayer";
import RepostButton from "../RepostButton/RepostButton";
import useStyles from "./Note.styles";
import { useRouter } from "next/router";
import { openSheet } from "store/Sheets";
import { useNote } from "ndk/hooks/useNote";
import { useNDK } from "ndk/NDKProvider";
import { formatETag, parseEventTags } from "ndk/utils";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { noop } from "../../utils/common";

const Note = (props) => {
  const { ndk } = useNDK();
  const { event, type, onUserDataLoad = noop } = props;
  const note = useNote({ event });
  const { classes } = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [downloadStatus, setDownloadStatus] = useState("initial");
  const { data: userData } = useProfile({
    pubkey: note.event.pubkey,
  });
  const downloadUrl = useMemo(() => {
    const downloadUrlTag =
      note.event.tags?.find((tag) => tag[0] === "download_url") || null;
    return downloadUrlTag ? downloadUrlTag[1] : null;
  }, [note]);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);

  const handleClickComment = (e) => {
    dispatch(openSheet({ sheetKey: "postSheet", replyingTo: note.event }));
  };

  const handleClickLike = (e) => {
    let created_at = Math.floor(Date.now() / 1000);
    const { root, mentions, reply } = parseEventTags(note.event);

    let eTags = [];
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

  useEffect(() => {
    if (!likedByCurrentUser) {
      if (note.reactions.find((ev) => ev.pubkey === auth.pk)) {
        setLikedByCurrentUser(true);
      }
    }
  }, [note.reactions.length, auth.pk]);

  useEffect(() => {
    if (userData) {
      onUserDataLoad();
    }
  }, [userData]);

  const handleClick = () => {
    router.push(`/thread/${note.event.id}`);
  };

  return (
    <Stack onClick={handleClick} sx={{ cursor: "pointer" }}>
      <NoteHeader
        note={note}
        userData={userData}
        downloadUrl={downloadUrl}
        downloadStatus={downloadStatus}
        setDownloadStatus={setDownloadStatus}
      />
      <Group noWrap>
        {type === "parent" && (
          <Box
            pl="md"
            mr="md"
            sx={(theme) => ({
              alignSelf: "stretch",
              borderRight: `1px solid ${theme.colors.gray[4]}`,
            })}
          />
        )}
        <Stack sx={{ flexGrow: 1, overflowX: "auto" }}>
          <SoundPlayer
            event={note.event}
            downloadStatus={downloadStatus}
            setDownloadStatus={setDownloadStatus}
          />
          <Text c="white" sx={{ overflowWrap: "anywhere" }}>
            {note.event.content}
          </Text>
          <NoteTags note={note} classes={classes} />
          <Group position="apart">
            <NoteActionComment note={note} onClick={handleClickComment} />
            {/* <RepostButton note={note} /> */}
            <NoteActionLike
              note={note}
              onClick={handleClickLike}
              likedByCurrentUser={likedByCurrentUser}
            />
            {/* <NoteAction>
            <ZapIcon width={18} height={18} /> 4
          </NoteAction> */}
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
};

export default Note;

export function FeedNote(props) {
  const { classes } = useStyles();

  return (
    <Box className={classes.box}>
      <Note {...props} />
    </Box>
  );
}
