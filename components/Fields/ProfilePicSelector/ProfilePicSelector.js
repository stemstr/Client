import { Avatar, Box, Center, FileInput, TextInput } from "@mantine/core";
import { useRef } from "react";
import { CameraPlusIcon } from "../../../icons/StemstrIcon";
import { uploadImage } from "../../../utils/media";

export default function ProfilePicSelector(props) {
  const inputRef = useRef(null);

  const handleSelectClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (file) => {
    uploadImage(file)
      .then((imageUrl) => props.onChange(imageUrl))
      .catch((err) => props.onChange(""));
  };

  return (
    <>
      <Box
        sx={{
          display: "none",
        }}
      >
        <TextInput {...props} />
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
          src={props.value && props.value}
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
            opacity: props.value ? 0.5 : undefined,
          }}
        >
          <CameraPlusIcon width={32} height={35} />
        </Center>
      </Box>
    </>
  );
}
