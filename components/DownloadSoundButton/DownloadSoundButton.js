import { Anchor, Center } from "@mantine/core";
import { DownloadCloudIcon } from "../../icons/StemstrIcon";

export default function DownloadSoundButton({ href }) {
  const buttonElement = href && (
    <Center
      sx={(theme) => ({
        width: 28,
        height: 28,
        backgroundColor: "rgba(9, 213, 176, 0.08)",
        borderRadius: "50%",
        border: "1px solid",
        borderColor: theme.colors.green[2],
        color: theme.colors.green[2],
        cursor: "pointer",
        transition: "all 0.3s",
      })}
    >
      <DownloadCloudIcon width={16} height={16} />
    </Center>
  );

  return (
    <Anchor href={href} download>
      {buttonElement}
    </Anchor>
  );
}
