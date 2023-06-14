import { Avatar, Box, Center, FileInput, TextInput } from "@mantine/core";
import { CameraPlusIcon, EditIcon } from "icons/StemstrIcon";
import { useRef } from "react";
import { uploadImage } from "utils/media";

export default function ProfilePicSelector(props: any) {
  const inputRef = useRef<HTMLButtonElement>(null);

  const handleSelectClick = () => {
    inputRef.current?.click();
  };

  const handleImageChange = (file: File) => {
    uploadImage(file)
      .then((imageUrl) => {
        if (props.onChange) {
          props.onChange(imageUrl);
        }
      })
      .catch((err) => {
        if (props.onChange) {
          props.onChange("");
        }
      });
  };

  return (
    <>
      <Box hidden>
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
          src={props.value as string}
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
          <EditIcon color="white" width={26} height={26} />
        </Center>
      </Box>
    </>
  );
}
