import { Box, Group, Stack, Text } from "@mantine/core";
import { Kind, nip19 } from "nostr-tools";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cacheProfile, getCachedProfile } from "../../cache/cache";
import { CommentIcon, ShakaIcon, ZapIcon } from "../../icons/StemstrIcon";
import useNostr from "../../nostr/hooks/useNostr";
import { useProfile } from "../../nostr/hooks/useProfile";
import NoteTags from "../NoteTags/NoteTags";
import NoteHeader from "../NoteHeader/NoteHeader";
import NoteAction from "../NoteAction/NoteAction";
import SoundPlayer from "../SoundPlayer/SoundPlayer";
import RepostButton from "../RepostButton/RepostButton";
import useStyles from "./Note.styles";
import { useRouter } from "next/router";
import { openSheet } from "store/Sheets";

export default function Note(props) {
  const { note, type } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const { publish, signEvent } = useNostr();
  const auth = useSelector((state) => state.auth);
  const cachedProfile = getCachedProfile(nip19.npubEncode(note.event.pubkey));
  const [userData, setUserData] = useState(cachedProfile);
  const [profileFetched, setProfileFetched] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("initial");
  const { data } = useProfile({
    pubkey: note.event.pubkey,
  });
  const downloadUrl = useMemo(() => {
    const downloadUrlTag =
      note.event.tags?.find((tag) => tag[0] === "download_url") || null;
    return downloadUrlTag ? downloadUrlTag[1] : null;
  }, [note.event]);

  const handleClickShaka = () => {
    let created_at = Math.floor(Date.now() / 1000);
    let tags = [
      ["p", note.event.pubkey],
      ["e", note.event.id],
    ];
    let reactionEvent = {
      kind: Kind.Reaction,
      created_at: created_at,
      tags: tags,
      content: "🤙",
    };
    signEvent(reactionEvent).then((reactionEvent) => {
      if (reactionEvent) {
        publish(reactionEvent, [process.env.NEXT_PUBLIC_STEMSTR_RELAY]);
      }
    });
  };

  const handleClickComment = (e) => {
    dispatch(openSheet({ sheetKey: "postSheet", replyingTo: note.event }));
  };

  const handleClick = () => {
    router.push(`/thread/${note.event.id}`);
  };

  useEffect(() => {
    if (!profileFetched && data) {
      setProfileFetched(true);
      setUserData(data);
      cacheProfile(data.npub, data);
    }
  }, [data, setUserData]);

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
        <Stack sx={{ flexGrow: 1 }}>
          <SoundPlayer
            event={note.event}
            downloadStatus={downloadStatus}
            setDownloadStatus={setDownloadStatus}
          />
          <Text c="white" sx={{ overflowWrap: "anywhere" }}>
            {note.event.content}
          </Text>
          <NoteTags note={note} />
          <Group position="apart">
            <NoteAction onClick={handleClickComment}>
              <Group position="center" spacing={6}>
                <CommentIcon width={18} height={18} />{" "}
                <Text lh="normal" c="gray.1">
                  {note.replies.length}
                </Text>
              </Group>
            </NoteAction>
            {/* <RepostButton note={note} /> */}
            {/* <NoteAction>
            <ShakaIcon onClick={handleClickShaka} width={18} height={18} /> 0
          </NoteAction> */}
            {/* <NoteAction>
            <ZapIcon width={18} height={18} /> 4
          </NoteAction> */}
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
}

export function FeedNote(props) {
  const { classes } = useStyles();

  return (
    <Box className={classes.box}>
      <Note {...props} />
    </Box>
  );
}
