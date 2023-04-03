import { Box, Center, FileInput, Group, Text } from "@mantine/core";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { PlusIcon, PlayIcon, StopIcon } from "../../../icons/StemstrIcon";
import WaveForm from "../../WaveForm/WaveForm";

export default function SoundPicker({ form, isDragging, ...rest }) {
  const auth = useSelector((state) => state.auth);
  const [audioBlobURL, setAudioBlobURL] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveformData, setWaveformData] = useState(null);
  const audioRef = useRef(null);
  const inputRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(null);
  const playProgress = useMemo(() => {
    return duration ? currentTime / duration : 0;
  }, [currentTime, duration]);

  const handleAudioChange = async () => {
    form.setValues((prev) => ({
      ...prev,
      "uploadResponse.streamUrl": null,
      "uploadResponse.downloadUrl": null,
    }));
    setIsPlaying(false);
    if (rest.value) {
      let sum = await calculateHash(rest.value);
      const formData = new FormData();
      formData.append("pk", auth.user.pk);
      formData.append("sum", sum);
      formData.append("filename", rest.value.name);
      formData.append("file", rest.value);
      axios
        .post(`${process.env.NEXT_PUBLIC_STEMSTR_API}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setAudioBlobURL(URL.createObjectURL(rest.value));
          setWaveformData(response.data.waveform);
          form.setFieldValue(
            "uploadResponse.streamUrl",
            response.data.stream_url
          );
          form.setFieldValue(
            "uploadResponse.downloadUrl",
            response.data.download_url
          );
        })
        .catch((error) => {
          rest.onChange(null);
          console.error(error);
        });
    }
  };

  useEffect(() => {
    if (!rest.value) {
      setWaveformData(null);
    }
  }, [rest.value]);

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

  const handleTimeUpdate = () => {
    const { currentTime } = audioRef.current;
    setCurrentTime(currentTime);
  };

  const handleCanPlay = () => {
    setDuration(audioRef.current.duration);
  };

  useEffect(() => {
    handleAudioChange();
  }, [rest.value]);

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
          {...rest}
        />
      </Box>
      <Group
        position={rest.value ? null : "center"}
        sx={(theme) => ({
          background: isDragging
            ? "linear-gradient(180deg, #383864 0%, rgba(71, 47, 111, 0.21) 100%)"
            : "linear-gradient(180deg, rgba(44, 44, 44, 0) 0%, rgba(134, 90, 226, 0.4) 100%);",
          padding: "14px 16px",
          borderRadius: 8,
          border: `1px solid rgba(187, 134, 252, 0.4)`,
          height: 96,
        })}
      >
        {rest.value ? (
          <>
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

            <audio
              ref={audioRef}
              src={audioBlobURL}
              onEnded={handleAudioEnded}
              onCanPlay={handleCanPlay}
              onTimeUpdate={handleTimeUpdate}
            />
            <WaveForm data={waveformData} playProgress={playProgress} />
          </>
        ) : (
          <Center
            onClick={handleSelectClick}
            sx={(theme) => ({
              // height: 28,
              padding: `4px 8px`,
              backgroundColor: theme.colors.purple[4],
              borderRadius: theme.radius.xl,
              color: theme.white,
              cursor: "pointer",
              color: theme.colors.purple[5],
              border: `1px solid ${theme.colors.purple[5]}`,
              background: `linear-gradient(135deg, #F9F5FF 0%, #A17BF0 100%)`,
            })}
          >
            <PlusIcon width={16} height={16} />
            <Text fz="xs" ml={2}>
              {isDragging ? "Drop sound" : "Add sound"}
            </Text>
          </Center>
        )}
      </Group>
    </>
  );
}

async function calculateHash(file) {
  if (!file) return null;
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    await file.arrayBuffer()
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
