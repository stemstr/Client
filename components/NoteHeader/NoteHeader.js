import { Anchor, Avatar, Center, Group, Text } from "@mantine/core";
import { MoreIcon, VerifiedIcon } from "../../icons/StemstrIcon";
import DownloadSoundButton from "../DownloadSoundButton/DownloadSoundButton";
import Link from "next/link";
import withStopClickPropagation from "../../utils/hoc/withStopClickPropagation";
import { getRelativeTimeString } from "nostr";

const NoteHeader = ({
  note,
  userData,
  downloadUrl,
  downloadStatus,
  setDownloadStatus,
}) => {
  return (
    <Group position="apart">
      <Group spacing={6}>
        <Anchor
          component={Link}
          href={`/user/${note.event.pubkey}`}
          sx={{
            ":hover": {
              textDecoration: "none",
            },
          }}
        >
          <Group spacing={6}>
            <Avatar
              src={userData?.picture}
              alt={userData?.name}
              size={42}
              radius="50%"
            />
            <Text size="lg" color="white">
              {userData?.display_name
                ? userData.display_name
                : `@${note.event.pubkey.substring(0, 5)}...`}
            </Text>
            <VerifiedIcon width={14} height={14} />
            <Text size="xs" color="rgba(255, 255, 255, 0.74)">
              {userData?.name ? `@${userData.name}` : ""}
            </Text>
          </Group>
        </Anchor>
        <Text size="sm" color="rgba(255, 255, 255, 0.38)">
          · {getRelativeTimeString(note.event.created_at)}
        </Text>
      </Group>
      <Group position="right">
        <DownloadSoundButton
          href={downloadUrl}
          downloadStatus={downloadStatus}
          setDownloadStatus={setDownloadStatus}
        />
        <Center
          sx={(theme) => ({
            width: 28,
            height: 28,
            color: theme.colors.gray[2],
          })}
        >
          <MoreIcon width={24} height={24} />
        </Center>
      </Group>
    </Group>
  );
};

export default withStopClickPropagation(NoteHeader);
