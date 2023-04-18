import { Anchor, Center } from "@mantine/core";
import useFeatureDetection, { FeatureName } from "hooks/useFeatureDetection";
import {
  DownloadIcon,
  CheckIcon,
  DownloadCloudIcon,
} from "../../icons/StemstrIcon";

export default function DownloadSoundButton({
  href,
  downloadStatus,
  setDownloadStatus,
}) {
  const dragToDownloadSupported = useFeatureDetection(
    FeatureName.DragToDownload
  );

  const handleClick = () => {
    switch (downloadStatus) {
      case "initial":
        setDownloadStatus("pending");
      case "pending":

      case "ready":

      default:
        return null;
    }
  };

  const renderIcon = () => {
    switch (downloadStatus) {
      case "initial":
        return <DownloadIcon width={16} height={16} />;
      case "pending":
        return <CheckIcon width={16} height={16} />;
      case "ready":
        return <DownloadCloudIcon width={16} height={16} />;
      default:
        return null;
    }
  };

  const buttonElement = href && (
    <Center
      onClick={dragToDownloadSupported ? handleClick : undefined}
      sx={(theme) => ({
        width: 28,
        height: 28,
        backgroundColor:
          downloadStatus === "initial"
            ? theme.fn.rgba(theme.white, 0.08)
            : "rgba(9, 213, 176, 0.08)",
        borderRadius: "50%",
        border: "1px solid",
        // borderColor: theme.colors.gray[2],
        borderColor:
          downloadStatus === "initial" ? "#A39DAD" : theme.colors.green[2],
        color:
          downloadStatus === "initial" ? theme.white : theme.colors.green[2],
        cursor: downloadStatus !== "pending" && "pointer",
        transition: "all 0.3s",
        ":hover": {
          backgroundColor:
            downloadStatus === "initial" && theme.colors.green[2],
          borderColor: downloadStatus === "initial" && theme.colors.green[0],
        },
      })}
    >
      {renderIcon()}
    </Center>
  );

  return (downloadStatus === "ready" && href) || !dragToDownloadSupported ? (
    <Anchor href={href} download>
      {buttonElement}
    </Anchor>
  ) : (
    buttonElement
  );
}
