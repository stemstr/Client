import { Box, Center, FileInput, Group, Text } from "@mantine/core";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PlusIcon,
  PlayIcon,
  StopIcon,
  CompassIcon,
} from "../../../icons/StemstrIcon";
import WaveForm from "../../WaveForm/WaveForm";
import Hls from "hls.js";
import { useRouter } from "next/router";
import { closeSheet } from "../../../store/Sheets";
import { acceptedMimeTypes } from "../../../utils/media";
import { Route } from "../../../enums";

export default function SoundPicker({
  form,
  isDragging,
  isUploading,
  setIsUploading,
  ...rest
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveformData, setWaveformData] = useState(null);
  const audioRef = useRef(null);
  const audioTimeUpdateTimeoutRef = useRef();
  const hlsRef = useRef(null);
  const inputRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(null);
  const playProgress = useMemo(() => {
    return duration ? currentTime / duration : 0;
  }, [currentTime, duration]);
  const [streamUrl, setStreamUrl] = useState(null);
  const [mediaAttached, setMediaAttached] = useState(false);
  const [soundPickerFocused, setSoundPickerFocused] = useState(false);

  const handleAudioChange = async () => {
    form.setValues((prev) => ({
      ...prev,
      "uploadResponse.streamUrl": null,
      "uploadResponse.downloadUrl": null,
    }));
    setIsPlaying(false);
    if (rest.value) {
      const sum = await calculateHash(rest.value);
      const maxFileSizeMB = 100;
      const maxFileSize = 1024 * 1024 * maxFileSizeMB;
      if (rest.value.size > maxFileSize) {
        alert(`File too big (Max ${maxFileSizeMB}MB)`);
        rest.onChange(null);
      } else {
        const formData = new FormData();
        formData.append("pk", auth.user.pk);
        formData.append("sum", sum);
        formData.append("filename", rest.value.name);
        formData.append("file", rest.value);
        setIsUploading(true);
        setWaveformData(null);
        axios
          .post(`${process.env.NEXT_PUBLIC_STEMSTR_API}/upload`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            setStreamUrl(response.data.stream_url);
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
            switch (error.response.status) {
              case 400:
                alert(error.response.data);
                break;
              case 401:
                dispatch(closeSheet("postSheet"));
                router.push(Route.Login);
                break;
              case 500:
                alert("Server error. Please try again later.");
                break;
              default:
                break;
            }
            rest.onChange(null);
          })
          .finally(() => {
            setIsUploading(false);
          });
      }
    }
  };

  useEffect(() => {
    if (!rest.value) {
      setStreamUrl(null);
    }
    if (streamUrl) {
      if (Hls.isSupported()) {
        hlsRef.current = new Hls();
        hlsRef.current.loadSource(streamUrl);
        hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
          // console.log("HLS manifest parsed");
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
        setMediaAttached(false);
      }
    };
  }, [streamUrl, rest.value, setStreamUrl, setMediaAttached]);

  const attachMedia = () => {
    if (!mediaAttached && hlsRef.current) {
      hlsRef.current.attachMedia(audioRef.current);
      setMediaAttached(true);
    }
  };

  useEffect(() => {
    if (!rest.value) {
      setWaveformData(null);
    }
  }, [rest.value, setWaveformData]);

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
    setIsPlaying(false);
  };

  const handleSelectClick = () => {
    inputRef.current.click();
  };

  const handleCanPlay = () => {
    setDuration(audioRef.current.duration);
    trackAudioTime();
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

  useEffect(() => {
    handleAudioChange();
  }, [rest.value]);

  return (
    <>
      <Box
        sx={{
          opacity: 0,
          width: 0,
          height: 0,
        }}
      >
        <FileInput
          accept={acceptedMimeTypes.join(", ")}
          ref={inputRef}
          {...rest}
          onFocus={() => setSoundPickerFocused(true)}
          onBlur={() => setSoundPickerFocused(false)}
        />
      </Box>
      <Group
        spacing={(isUploading || !rest.value) && 0}
        sx={(theme) => ({
          background: isDragging
            ? "linear-gradient(180deg, #383864 0%, rgba(71, 47, 111, 0.21) 100%)"
            : "linear-gradient(180deg, rgba(44, 44, 44, 0) 0%, rgba(134, 90, 226, 0.4) 100%);",
          padding: "14px 16px",
          borderRadius: 8,
          border: "1px solid",
          borderColor: soundPickerFocused
            ? theme.colors.purple[5]
            : "rgba(187, 134, 252, 0.4)",
          height: 96,
          transition: "gap .5s ease",
        })}
      >
        <audio
          ref={audioRef}
          onEnded={handleAudioEnded}
          onCanPlay={handleCanPlay}
        />
        {(isUploading || streamUrl) && (
          <Center
            onClick={isPlaying ? handlePauseClick : handlePlayClick}
            sx={(theme) => ({
              opacity: !!streamUrl,
              width: isUploading || !rest.value ? 0 : 36,
              height: 36,
              backgroundColor: theme.colors.purple[5],
              borderRadius: theme.radius.xl,
              color: theme.white,
              cursor: "pointer",
              transition: "width .5s ease, opacity .5s ease",
            })}
          >
            {isPlaying ? (
              <StopIcon width={16} height={16} />
            ) : (
              <PlayIcon width={16} height={16} />
            )}
          </Center>
        )}
        {rest.value && (
          <WaveForm data={waveformData} playProgress={playProgress} />
        )}
        {(isUploading || !rest.value) && (
          <Group
            position="center"
            sx={{ position: "absolute", left: 0, right: 0 }}
          >
            <Center
              onClick={!isUploading ? handleSelectClick : () => {}}
              sx={(theme) => ({
                padding: `4px 8px`,
                backgroundColor: theme.colors.purple[4],
                borderRadius: theme.radius.xl,
                color: theme.white,
                cursor: !isUploading && "pointer",
                color: theme.colors.purple[5],
                border: `1px solid ${theme.colors.purple[5]}`,
                background: `linear-gradient(135deg, #F9F5FF 0%, #A17BF0 100%)`,
              })}
            >
              {isUploading ? (
                <CompassIcon color="white" width={16} height={16} />
              ) : (
                <PlusIcon width={16} height={16} />
              )}

              <Text fz="xs" ml={2}>
                {isUploading
                  ? "Processing sound"
                  : isDragging
                  ? "Drop sound"
                  : "Add sound"}
              </Text>
            </Center>
          </Group>
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
