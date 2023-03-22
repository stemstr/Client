import { Box, Center, FileInput, Group } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { PlusIcon, PlayIcon, StopIcon } from "../../../icons/StemstrIcon";
import WaveForm from "../../WaveForm/WaveForm";

export default function SoundPicker(props) {
  const [audioBlobURL, setAudioBlobURL] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const inputRef = useRef(null);

  const handleAudioChange = () => {
    if (props.value) setAudioBlobURL(URL.createObjectURL(props.value));
    setIsPlaying(false);
  };

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
    setIsPlaying(false);
  };

  const handleSelectClick = () => {
    inputRef.current.click();
  };

  useEffect(() => {
    handleAudioChange();
  }, [props.value]);

  return (
    <>
      <Box
        sx={{
          display: "none",
        }}
      >
        <FileInput
          accept="audio/*"
          ref={inputRef}
          style={{ display: "none" }}
          {...props}
        />
      </Box>
      <Group
        sx={(theme) => ({
          background:
            "linear-gradient(180deg, rgba(44, 44, 44, 0) 0%, rgba(134, 90, 226, 0.4) 100%);",
          padding: "14px 16px",
          borderRadius: 8,
          border: `1px solid rgba(187, 134, 252, 0.4)`,
        })}
      >
        {props.value ? (
          <Center
            onClick={isPlaying ? handlePauseClick : handlePlayClick}
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
        ) : (
          <Center
            onClick={handleSelectClick}
            sx={(theme) => ({
              width: 36,
              height: 36,
              backgroundColor: theme.colors.purple[4],
              borderRadius: theme.radius.xl,
              color: theme.white,
              cursor: "pointer",
            })}
          >
            <PlusIcon width={20} height={20} />
          </Center>
        )}
        {props.value && (
          <audio ref={audioRef} src={audioBlobURL} onEnded={handleAudioEnded} />
        )}
        <WaveForm data={props.value} />
      </Group>
    </>
  );
}
