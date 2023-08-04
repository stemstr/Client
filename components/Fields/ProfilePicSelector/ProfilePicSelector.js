import {
  Avatar,
  Box,
  Center,
  FileInput,
  Loader,
  TextInput,
} from "@mantine/core";
import { useRef } from "react";
import { CameraPlusIcon } from "../../../icons/StemstrIcon";
import { uploadImage } from "../../../utils/media";

export default function ProfilePicSelector({
  isUploading,
  setIsUploading,
  ...rest
}) {
  const inputRef = useRef(null);

  const handleSelectClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (file) => {
    rest.onChange("");
    setIsUploading(true);
    uploadImage(file)
      .then((imageUrl) => rest.onChange(imageUrl))
      .catch((err) => rest.onChange(""))
      .finally(() => setIsUploading(false));
  };

  return (
    <>
      <Box
        sx={{
          display: "none",
        }}
      >
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
          transition: "border-color .3s ease-in-out",
          ":hover": {
            borderColor: theme.white,
          },
        })}
      >
        <Avatar
          src={rest.value && rest.value}
          styles={(theme) => ({
            root: {
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
            opacity: rest.value ? 0.5 : undefined,
          }}
        >
          {isUploading ? (
            <Loader size="md" />
          ) : (
            <CameraPlusIcon width={32} height={35} />
          )}
        </Center>
      </Box>
    </>
  );
}
