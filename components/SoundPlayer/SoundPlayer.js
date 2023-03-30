import { Center, Group, Stack, Text } from "@mantine/core";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { PlayIcon, StopIcon } from "../../icons/StemstrIcon";
import WaveForm from "../WaveForm/WaveForm";
import useStyles from "./SoundPlayer.styles";

export default function SoundPlayer({ event, ...rest }) {
  const audioRef = useRef();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(null);
  const playProgress = useMemo(() => {
    return duration ? currentTime / duration : 0;
  }, [currentTime, duration]);
  const [canDownload, setCanDownload] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const downloadUrl = useMemo(() => {
    const downloadUrlTag =
      event.tags?.find((tag) => tag[0] === "download_url") || null;
    return downloadUrlTag ? downloadUrlTag[1] : null;
  }, [event]);
  const { classes } = useStyles();
  const [waveformData, setWaveformData] = useState([]);

  useEffect(() => {
    if (downloadUrl) {
      let hash = downloadUrl?.slice(downloadUrl.lastIndexOf("/") + 1);
      axios
        .get(`${process.env.NEXT_PUBLIC_STEMSTR_API}/metadata/${hash}`)
        .then((response) => {
          // console.log(response.data.waveform);
          setWaveformData(response.data.waveform);
        });
    }
  }, [event]);

  const handleTimeUpdate = () => {
    const { currentTime } = audioRef.current;
    setCurrentTime(currentTime);
  };

  const handlePlayClick = () => {
    if (audioRef.current && !isPlaying) {
      setCanDownload(true);
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

  return (
    downloadUrl && (
      <Stack justify="center" spacing={0} className={classes.player}>
        <Group>
          <Center
            onClick={isPlaying ? handlePauseClick : handlePlayClick}
            onMouseOver={() => setCanDownload(true)}
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

          {canDownload && (
            <audio
              ref={audioRef}
              src={downloadUrl}
              onCanPlay={handleCanPlay}
              onEnded={handleAudioEnded}
              onTimeUpdate={handleTimeUpdate}
            />
          )}

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
