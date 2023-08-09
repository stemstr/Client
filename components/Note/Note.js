import { Box, Group, Stack } from "@mantine/core";
import React, { useMemo } from "react";
import NoteTags from "../NoteTags/NoteTags";
import NoteHeader from "../NoteHeader/NoteHeader";
import SoundPlayer from "../SoundPlayer/SoundPlayer";
import useStyles from "./Note.styles";
import { useRouter } from "next/router";
import { useEvent } from "../../ndk/NDKEventProvider";
import NoteActionRow from "../NoteActionRow/NoteActionRow";
import { Route } from "enums";
import NoteContent from "../NoteContent/NoteContent";
import NoteRepostHeader from "components/NoteHeader/NoteRepostHeader";
import NoteReplyingToHeader from "components/NoteHeader/NoteReplyingToHeader";

const Note = ({ type }) => {
  const { event, repostedBy } = useEvent();
  const { classes } = useStyles();
  const router = useRouter();
  const downloadUrl = useMemo(() => {
    const downloadUrlTag =
      event.tags?.find((tag) => tag[0] === "download_url") || null;
    return downloadUrlTag ? downloadUrlTag[1] : null;
  }, [event]);
  const isInThread = type !== undefined;

  const handleClick = () => {
    router.push({
      pathname: Route.Thread,
      query: { noteId: event.id },
    });
  };

  return (
    <Stack onClick={handleClick} sx={{ cursor: "pointer" }}>
      {!isInThread && !repostedBy && <NoteReplyingToHeader />}
      {repostedBy && <NoteRepostHeader />}
      <NoteHeader downloadUrl={downloadUrl} />
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
          <SoundPlayer event={event} />
          <NoteContent content={event.content} />
          <NoteTags classes={classes} />
          <NoteActionRow />
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
