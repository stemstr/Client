import { Box, Center, FileInput, Image, TextInput } from "@mantine/core";
import { useRef } from "react";
import { CameraPlusIcon } from "../../../icons/StemstrIcon";
import { uploadImage } from "../../../utils/media";

export default function BannerSelector(props) {
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
          height: 169,
          backgroundColor: theme.colors.gray[6],
          margin: `-${theme.spacing.md}px -${theme.spacing.md}px 0`,
          padding: `${theme.spacing.md}px ${theme.spacing.md}px 0`,
          fontSize: theme.fontSizes.xs,
          color: theme.white,
          position: "relative",
          cursor: "pointer",
        })}
      >
        {props.value && (
          <Image
            src={props.value}
            height={169}
            styles={(theme) => ({
              root: {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
              },
              imageWrapper: {
                position: "static",
              },
            })}
          />
        )}
        {!props.value && (
          <Center
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            Add a profile and cover photo
          </Center>
        )}
        <Box
          sx={(theme) => ({
            right: theme.spacing.md,
            bottom: theme.spacing.md,
            position: "absolute",
            opacity: props.value ? 0.5 : undefined,
          })}
        >
          <CameraPlusIcon width={20} height={20} />
        </Box>
      </Box>
    </>
  );
}
