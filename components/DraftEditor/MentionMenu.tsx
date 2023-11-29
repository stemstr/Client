import { Avatar, Box, Group, Stack, Text } from "@mantine/core";
import { useDraftEditor } from "./DraftEditorProvider";
import { useUser } from "ndk/hooks/useUser";
import useProfilePicSrc from "ndk/hooks/useProfilePicSrc";

export default function MentionMenu() {
  const { mentionQuery, mentionOptions, focusedOptionIndex } = useDraftEditor();

  if (!mentionQuery) return null;

  const height = 375;

  return (
    <Box
      pos="absolute"
      left={0}
      top={-height}
      w="100%"
      h={height}
      bg="dark.8"
      sx={{ overflowY: "scroll" }}
    >
      {mentionOptions.map((user, index) => (
        <MentionMenuOption
          key={user.hexpubkey()}
          pubkey={user.hexpubkey()}
          isFocused={focusedOptionIndex === index}
        />
      ))}
    </Box>
  );
}

const MentionMenuOption = ({
  pubkey,
  isFocused,
}: {
  pubkey: string;
  isFocused: boolean;
}) => {
  const { handleMention } = useDraftEditor();
  const user = useUser(pubkey);
  const src = useProfilePicSrc(user);

  return (
    <Group
      onClick={() => handleMention(user)}
      p="md"
      spacing={12}
      bg={isFocused ? "dark.7" : undefined}
      sx={(theme) => ({
        cursor: "pointer",
        "&:hover": {
          backgroundColor: theme.colors.dark[7],
        },
      })}
    >
      <Avatar src={src} alt={user?.profile?.name} size={40} radius={20} />
      <Stack spacing={4}>
        <Text c="white" fz="md" fw={500} lh={1.25}>
          {user?.profile?.displayName || user?.profile?.name}
        </Text>
        <Text color="gray.1" fz="xs">
          @{user?.profile?.name || user?.profile?.displayName}
        </Text>
      </Stack>
    </Group>
  );
};
