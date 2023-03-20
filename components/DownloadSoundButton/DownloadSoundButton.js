import { Center } from "@mantine/core";
import { DownloadIcon } from "../../icons/StemstrIcon";

export default function DownloadSoundButton({ href }) {
  return (
    href && (
      <a href={href} download>
        <Center
          sx={(theme) => ({
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "1px solid",
            borderColor: theme.colors.gray[2],
            color: theme.white,
          })}
        >
          <DownloadIcon width={12} height={12} />
        </Center>
      </a>
    )
  );
}
