import {
  Box,
  Center,
  DefaultProps,
  Group,
  Stack,
  Text,
  clsx,
} from "@mantine/core";
import axios from "axios";
import {
  Dispatch,
  DragEventHandler,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronRightIcon, PlayIcon, StopIcon } from "../../icons/StemstrIcon";
import withStopClickPropagation, {
  WithStopClickPropagationProps,
} from "../../utils/hoc/withStopClickPropagation";
import WaveForm, { generateWaveFormData } from "../WaveForm/WaveForm";
import useStyles from "./SoundPlayer.styles";
import Hls from "hls.js";
import { NDKEvent } from "@nostr-dev-kit/ndk";

interface SoundPlayerProps extends DefaultProps, WithStopClickPropagationProps {
  event: NDKEvent;
  downloadStatus: string;
  setDownloadStatus: Dispatch<SetStateAction<string>>;
}

const SoundPlayer = ({
  event,
  downloadStatus,
  setDownloadStatus,
  ...rest
}: SoundPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioTimeUpdateTimeoutRef = useRef<NodeJS.Timeout>();
  const hlsRef = useRef<Hls | null>(null);
  const [mediaAttached, setMediaAttached] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [scrubTime, setScrubTime] = useState(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const downloadUrl = useMemo(() => {
    const downloadUrlTag =
      event.tags?.find((tag) => tag[0] === "download_url") || null;
    return downloadUrlTag ? downloadUrlTag[1] : null;
  }, [event]);
  const [mimeType, setMimeType] = useState("");
  const [fileName, setFileName] = useState("");
  const dragImageRef = useRef(null);
  const streamUrl = useMemo(() => {
    const streamUrlTag =
      event.tags?.find((tag) => tag[0] === "stream_url") || null;
    return streamUrlTag ? streamUrlTag[1] : null;
  }, [event]);
  const { classes } = useStyles();
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const dragImage = useMemo(() => {
    const img = document.createElement("img");
    img.src = "/img/drag-stem.svg";
    return img;
  }, []);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (streamUrl) {
      const waveformTag = event.tags.find((tag) => tag[0] === "waveform");
      if (waveformTag) {
        const waveformData = JSON.parse(waveformTag[1]);
        setWaveformData(waveformData);
      } else {
        setWaveformData(generateWaveFormData(64));
      }
      if (Hls.isSupported()) {
        hlsRef.current = new Hls();
        hlsRef.current.loadSource(streamUrl);
        hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
          // console.log("HLS manifest parsed");
        });
      } else if (
        audioRef.current?.canPlayType("application/vnd.apple.mpegurl")
      ) {
        audioRef.current.src = streamUrl;
      } else {
        console.error("HLS is not supported by this browser");
      }
    }
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [event, setWaveformData]);

  const handlePlayClick = () => {
    if (audioRef.current && !isPlaying) {
      setIsPlaying(true);
      audioRef.current.play();
    }
  };

  const handlePauseClick = () => {
    if (audioRef.current && isPlaying) {
      setIsPlaying(false);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleAudioEnded = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleCanPlay = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      trackAudioTime();
    }
  };

  const trackAudioTime = () => {
    if (audioRef.current) {
      const { currentTime } = audioRef.current;
      setCurrentTime(currentTime);

      const frameRate = 30;
      const interval = 1000 / frameRate; // interval in ms to achieve 30fps
      audioTimeUpdateTimeoutRef.current = setTimeout(trackAudioTime, interval);
    }
  };

  useEffect(() => {
    return () => {
      // Clear the timeout when the component unmounts
      if (audioTimeUpdateTimeoutRef.current) {
        clearTimeout(audioTimeUpdateTimeoutRef.current);
      }
    };
  }, []);

  const attachMedia = () => {
    if (!mediaAttached && hlsRef.current && audioRef.current) {
      hlsRef.current.attachMedia(audioRef.current);
      setMediaAttached(true);
    }
  };

  useEffect(() => {
    attachMedia();
  }, [hlsRef.current, audioRef.current]);

  const handleDragStart: DragEventHandler<HTMLDivElement> = (event) => {
    console.log(`${mimeType}:${fileName}:${blobUrl}`);
    event.dataTransfer.setData(
      "DownloadURL",
      `${mimeType}:${fileName}:${blobUrl}`
    );
    event.dataTransfer.setDragImage(
      dragImage,
      dragImage.width / 2,
      dragImage.height / 2
    );
  };

  const downloadAudio = async () => {
    if (downloadUrl) {
      try {
        const response = await axios.get(downloadUrl, {
          responseType: "arraybuffer",
        });
        setMimeType(response.headers["content-type"]);
        setFileName(response.headers["x-download-filename"]);
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setDownloadStatus("ready");
      } catch (error) {
        console.error("Error downloading the audio file:", error);
      }
    }
  };

  useEffect(() => {
    if (downloadUrl && downloadStatus === "pending") {
      downloadAudio();
    }
  }, [downloadStatus]);

  return downloadUrl ? (
    <Box p={1} className={classes.playerBorder} {...rest}>
      <Box className={classes.playerBackdrop}>
        <Group spacing={0} className={classes.player}>
          <Stack justify="center" spacing={0} className={classes.playerSection}>
            <Group>
              <Center
                onClick={isPlaying ? handlePauseClick : handlePlayClick}
                sx={(theme) => ({
                  width: 36,
                  height: 36,
                  backgroundColor: theme.colors.purple[5],
                  borderRadius: theme.radius.xl,
                  color: theme.white,
                  cursor: "pointer",
                })}
              >
                {isPlaying ? (
                  <StopIcon width={16} height={16} />
                ) : (
                  <PlayIcon width={16} height={16} />
                )}
              </Center>

              <audio
                ref={audioRef}
                onCanPlay={handleCanPlay}
                onEnded={handleAudioEnded}
              />

              <WaveForm
                data={waveformData}
                currentTime={currentTime}
                scrubTime={scrubTime}
                setScrubTime={setScrubTime}
                play={handlePlayClick}
                pause={handlePauseClick}
                audioRef={audioRef}
                duration={duration}
              />
            </Group>
            <Group position="apart">
              <Text fz="xs" c="white">
                {getFormattedPlayTime(scrubTime || currentTime)}
              </Text>
              <Text fz="xs" c="white">
                {getFormattedPlayTime(duration)}
              </Text>
            </Group>
          </Stack>
          <Box
            draggable
            onDragStart={handleDragStart}
            className={clsx({
              [classes.dragHandle]: true,
              [classes.dragHandleReady]: downloadStatus === "ready",
            })}
          >
            <Box sx={{ display: "none" }}>
              <img ref={dragImageRef} src="/logo.svg" />
            </Box>
            {downloadStatus === "ready" && (
              <Group
                spacing={0}
                position="right"
                align="center"
                sx={{ height: "100%", overflowX: "hidden", flexWrap: "nowrap" }}
              >
                <Center sx={{ marginRight: -8 }}>
                  <ChevronRightIcon width={14} height={14} />
                </Center>
                <Center sx={(theme) => ({ color: theme.white })}>
                  <ChevronRightIcon width={14} height={14} />
                </Center>
                <Box
                  sx={(theme) => ({
                    marginLeft: 6,
                    height: 24,
                    borderLeft: `2px solid ${theme.colors.purple[2]}`,
                  })}
                />
                <Box
                  sx={(theme) => ({
                    marginLeft: 2,
                    height: 24,
                    borderLeft: `2px solid ${theme.colors.purple[2]}`,
                  })}
                />
              </Group>
            )}
          </Box>
        </Group>
      </Box>
    </Box>
  ) : (
    <></>
  );
};

export default withStopClickPropagation<SoundPlayerProps>(SoundPlayer);

function getFormattedPlayTime(time: number | null) {
  if (time === null) return "-:--";
  let seconds = Math.floor(time);
  let minutes = Math.floor(seconds / 60);
  seconds -= 60 * minutes;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
