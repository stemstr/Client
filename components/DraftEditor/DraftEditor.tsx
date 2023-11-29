import { BoxProps, Button, Flex, Text } from "@mantine/core";
import DraftEditorTextarea from "./DraftEditorTextarea";
import { useDraftEditor } from "./DraftEditorProvider";
import { useEffect } from "react";

type DraftEditorProps = BoxProps & {
  replyingToName?: string;
  onChange: (value: string) => void;
};

export default function DraftEditor({
  replyingToName,
  onChange,
  ...rest
}: DraftEditorProps) {
  const { canPost, rawNoteContent } = useDraftEditor();

  useEffect(() => {
    onChange(rawNoteContent);
  }, [rawNoteContent]);

  return (
    <Flex
      p="xs"
      bg="gray.8"
      fz="xs"
      align="center"
      miw={0}
      gap="xs"
      sx={(theme) => ({
        border: "1px solid",
        borderColor: theme.colors.gray[4],
        borderRadius: 8,
        flexGrow: 1,
      })}
      {...rest}
    >
      {replyingToName && (
        <Text c="purple.5" span truncate maw={75} sx={{ flexShrink: 0 }}>
          {replyingToName}
        </Text>
      )}
      <DraftEditorTextarea />
      {canPost && (
        <Button
          type="submit"
          fz={13}
          mih={0}
          py={2}
          px={12}
          lh="normal"
          h={24}
          sx={{ borderRadius: 100 }}
        >
          Post
        </Button>
      )}
    </Flex>
  );
}
