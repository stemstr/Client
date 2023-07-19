import { Box, Group, Stack, Text } from "@mantine/core";
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
import { RepostIcon, VerifiedIcon } from "icons/StemstrIcon";
import useNip05 from "ndk/hooks/useNip05";
import { Nip05Status } from "store/Nip05";

const Note = ({ type }) => {
  const { event, repostedBy } = useEvent();
  const repostedByNip05Status = useNip05(
    repostedBy?.hexpubkey(),
    repostedBy?.profile?.nip05
  );
  const { classes } = useStyles();
  const router = useRouter();
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
      {repostedBy && (
        <Group spacing={0} c="white" fz="sm" lh="normal">
          <RepostIcon />
          <Text ml={8} fw="bold" span>
            @{repostedBy.profile.name}
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
      )}
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
