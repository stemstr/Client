import { Box, Group, Stack, Space } from "@mantine/core";
import React, { useMemo, useState } from "react";
import NoteTags from "../NoteTags/NoteTags";
import NoteHeader from "../NoteHeader/NoteHeader";
import NoteActionComment from "../NoteAction/NoteActionComment";
import NoteActionLike from "../NoteAction/NoteActionLike";
import SoundPlayer from "../SoundPlayer/SoundPlayer";
import useStyles from "./Note.styles";
import { useRouter } from "next/router";
import { useEvent } from "../../ndk/NDKEventProvider";
import { Route } from "enums";
import NoteActionZap from "../NoteActionZap/NoteActionZap";
import NoteContent from "../NoteContent/NoteContent";

const Note = ({ type }) => {
  const { event } = useEvent();
  const { classes } = useStyles();
  const router = useRouter();
  const [downloadStatus, setDownloadStatus] = useState("initial");
  const downloadUrl = useMemo(() => {
    const downloadUrlTag =
      event.tags?.find((tag) => tag[0] === "download_url") || null;
    return downloadUrlTag ? downloadUrlTag[1] : null;
  }, [event]);

  const handleClick = () => {
    router.push({
      pathname: Route.Thread,
      query: { noteId: event.id },
    });
  };

  return (
    <Stack onClick={handleClick} sx={{ cursor: "pointer" }}>
      <NoteHeader
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
            event={event}
            downloadStatus={downloadStatus}
            setDownloadStatus={setDownloadStatus}
          />
          <NoteContent content={event.content} />
          <NoteTags classes={classes} />
          <Group position="apart">
            <NoteActionComment />
            <Space w={59} />
            <NoteActionLike />
            <NoteActionZap />
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
