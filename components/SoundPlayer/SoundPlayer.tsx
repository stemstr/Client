import { Box, Center, DefaultProps, Group, Stack, Text } from "@mantine/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "../../icons/StemstrIcon";
import withStopClickPropagation, {
  WithStopClickPropagationProps,
} from "../../utils/hoc/withStopClickPropagation";
import WaveForm, { generateWaveFormData } from "../WaveForm/WaveForm";
import useStyles from "./SoundPlayer.styles";
import Hls from "hls.js";
import { NDKEvent } from "@nostr-dev-kit/ndk";

interface SoundPlayerProps extends DefaultProps, WithStopClickPropagationProps {
  event: NDKEvent;
}

const SoundPlayer = ({ event, ...rest }: SoundPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioTimeUpdateTimeoutRef = useRef<NodeJS.Timeout>();
  const hlsRef = useRef<Hls | null>(null);
  const [mediaAttached, setMediaAttached] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [scrubTime, setScrubTime] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const downloadUrl = useMemo(() => {
    const downloadUrlTag =
      event.tags?.find((tag) => tag[0] === "download_url") || null;
    return downloadUrlTag ? downloadUrlTag[1] : null;
  }, [event]);
  const streamUrl = useMemo(() => {
    const streamUrlTag =
      event.tags?.find((tag) => tag[0] === "stream_url") || null;
    return streamUrlTag ? streamUrlTag[1] : null;
  }, [event]);
  const { classes } = useStyles();
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const playButtonSpinVelocity = 1000;
  const playButtonSpin = useMemo(() => {
    if (!scrubTime || !duration) return 0;
    return ((scrubTime - currentTime) / duration) * playButtonSpinVelocity;
  }, [scrubTime, currentTime, duration]);

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
                  transition: "transform .1s ease",
                  transform: `rotate(${playButtonSpin}deg)`,
                })}
              >
                {isPlaying ? (
                  <PauseIcon width={16} height={16} />
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
