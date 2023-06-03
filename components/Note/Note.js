import { Box, Group, Stack, Text } from "@mantine/core";
import { Kind } from "nostr-tools";
import React, { useMemo, useState } from "react";
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

const Note = (props) => {
  const { event, type } = props;
  const note = useNote({ event });
  const { classes } = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [profileFetched, setProfileFetched] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("initial");
  const { data: userData } = useProfile({
    pubkey: note.event.pubkey,
  });
  const downloadUrl = useMemo(() => {
    const downloadUrlTag =
      note.event.tags?.find((tag) => tag[0] === "download_url") || null;
    return downloadUrlTag ? downloadUrlTag[1] : null;
  }, [note]);

  const handleClickComment = (e) => {
    dispatch(openSheet({ sheetKey: "postSheet", replyingTo: note.event }));
  };

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
            <NoteActionLike note={note} />
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
