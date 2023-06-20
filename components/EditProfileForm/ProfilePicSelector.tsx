import {
  Avatar,
  Box,
  Center,
  FileInput,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { EditIcon } from "icons/StemstrIcon";
import { useRef } from "react";
import { uploadImage } from "utils/media";

export default function ProfilePicSelector({ setIsUploading, ...rest }: any) {
  const inputRef = useRef<HTMLButtonElement>(null);
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.xs}px`);

  const handleSelectClick = () => {
    inputRef.current?.click();
  };

  const handleImageChange = (file: File) => {
    setIsUploading(true);
    uploadImage(file)
      .then((imageUrl) => {
        if (rest.onChange) {
          rest.onChange(imageUrl);
        }
      })
      .catch((err) => {
        if (rest.onChange) {
          rest.onChange("");
        }
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  return (
    <>
      <Box hidden>
        <TextInput {...rest} />
        <FileInput
          accept="image/*"
          ref={inputRef}
          onChange={handleImageChange}
        />
      </Box>
      <Box
        onClick={handleSelectClick}
        sx={(theme) => ({
          color: theme.white,
          width: 100,
          height: 100,
          margin: "auto",
          backgroundColor: theme.colors.gray[4],
          borderRadius: "50%",
          borderWidth: 4,
          borderStyle: "solid",
          borderColor: theme.colors.dark[7],
          cursor: "pointer",
          marginTop: -50,
          position: "relative",
          border: "1px dashed transparent",
          ":hover": {
            borderColor: theme.white,
          },
        })}
      >
        <Avatar
          src={rest.value as string}
          styles={(theme) => ({
            root: {
              filter: "brightness(0.5)",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
            },
          })}
        >
          <></>
        </Avatar>
        <Center
          sx={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: "absolute",
          }}
        >
          <EditIcon
            color="white"
            width={isDesktop ? 26 : 20}
            height={isDesktop ? 26 : 20}
          />
        </Center>
      </Box>
    </>
  );
}
