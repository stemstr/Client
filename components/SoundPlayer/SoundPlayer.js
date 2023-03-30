import { Center, Group, Stack, Text } from "@mantine/core";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { PlayIcon, StopIcon } from "../../icons/StemstrIcon";
import WaveForm from "../WaveForm/WaveForm";
import useStyles from "./SoundPlayer.styles";
import Hls from "hls.js";

export default function SoundPlayer({ event, ...rest }) {
  const audioRef = useRef();
  const hlsRef = useRef(null);
  const [mediaAttached, setMediaAttached] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(null);
  const playProgress = useMemo(() => {
    return duration ? currentTime / duration : 0;
  }, [currentTime, duration]);
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
  const [waveformData, setWaveformData] = useState([]);

  useEffect(() => {
    if (downloadUrl) {
      let hash = downloadUrl?.slice(downloadUrl.lastIndexOf("/") + 1);
      axios
        .get(`${process.env.NEXT_PUBLIC_STEMSTR_API}/metadata/${hash}`)
        .then((response) => {
          setWaveformData(response.data.waveform);
        });
    }
    if (streamUrl) {
      if (Hls.isSupported()) {
        hlsRef.current = new Hls();
        hlsRef.current.loadSource(streamUrl);
        hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("HLS manifest parsed");
        });
      } else if (
        audioRef.current.canPlayType("application/vnd.apple.mpegurl")
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
  }, [event]);

  const handleTimeUpdate = () => {
    const { currentTime } = audioRef.current;
    setCurrentTime(currentTime);
  };

  const handlePlayClick = () => {
    if (audioRef.current && !isPlaying) {
      attachMedia();
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
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const handleCanPlay = () => {
    setDuration(audioRef.current.duration);
  };

  const attachMedia = () => {
    if (!mediaAttached && hlsRef.current) {
      hlsRef.current.attachMedia(audioRef.current);
      setMediaAttached(true);
    }
  };

  return (
    downloadUrl && (
      <Stack justify="center" spacing={0} className={classes.player}>
        <Group>
          <Center
            onClick={isPlaying ? handlePauseClick : handlePlayClick}
            onMouseOver={() => attachMedia()}
            sx={(theme) => ({
              width: 36,
              height: 36,
              backgroundColor: theme.colors.purple[4],
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
            onTimeUpdate={handleTimeUpdate}
          />

          <WaveForm data={waveformData} playProgress={playProgress} />
        </Group>
        <Group position="apart">
          <Text fz="xs" c="white">
            {getFormattedPlayTime(currentTime)}
          </Text>
          <Text fz="xs" c="white">
            {getFormattedPlayTime(duration)}
          </Text>
        </Group>
      </Stack>
    )
  );
}

function getFormattedPlayTime(time) {
  if (time === null) return "-:--";
  let seconds = Math.floor(time);
  let minutes = Math.floor(seconds / 60);
  seconds -= 60 * minutes;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
