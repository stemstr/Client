import { Group, Text } from "@mantine/core";
import { useState } from "react";
import { CopyIcon, KeyIcon, CheckCircleIcon } from "../../icons/StemstrIcon";

export default function CopyNpub({ npub }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(npub);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  return (
    <Group
      onClick={handleClick}
      align="center"
      spacing={8}
      sx={(theme) => ({
        color: theme.fn.rgba(theme.white, 0.4),
        cursor: "pointer",
      })}
    >
      <Group
        spacing={6}
        sx={(theme) => ({
          borderRadius: theme.radius.xl,
          backgroundColor: theme.colors.gray[4],
          padding: 4,
        })}
      >
        <KeyIcon width={16} height={16} />
        <Text fz="xs" lh="normal">
          {npub.substring(0, 16)}:{npub.substring(npub.length - 16)}
        </Text>
      </Group>
      {isCopied ? (
        <CheckCircleIcon width={16} height={16} />
      ) : (
        <CopyIcon width={16} height={16} />
      )}
    </Group>
  );
}
