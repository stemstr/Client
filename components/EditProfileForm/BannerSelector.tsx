import { Box, Center, FileInput, Image, TextInput } from "@mantine/core";
import { EditIcon } from "icons/StemstrIcon";
import { useRef } from "react";
import { uploadImage } from "utils/media";

export default function BannerSelector(props: any) {
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
    <Box
      onClick={handleSelectClick}
      sx={(theme) => ({
        height: 200,
        backgroundColor: theme.colors.gray[6],
        margin: `-${theme.spacing.md}px -${theme.spacing.md}px 0`,
        padding: `0 ${theme.spacing.md}px 0`,
        fontSize: theme.fontSizes.xs,
        color: theme.white,
        position: "relative",
        cursor: "pointer",
        boxSizing: "content-box",
        border: "1px dashed transparent",
        ":hover": {
          borderColor: theme.white,
        },
      })}
    >
      <Box hidden>
        <TextInput {...props} />
        <FileInput
          accept="image/*"
          ref={inputRef}
          onChange={handleImageChange}
        />
      </Box>
      <Box pos="absolute" left={0} right={0} sx={{ zIndex: 1 }}>
        <Center mt={80}>
          <EditIcon width={26} height={26} color="white" />
        </Center>
      </Box>
      {props.value && (
        <Image
          src={props.value}
          height={200}
          styles={(theme) => ({
            root: {
              position: "absolute",
              cursor: "pointer",
              top: 0,
              left: 0,
              right: 0,
            },
            imageWrapper: {
              filter: "brightness(0.5)",
              position: "static",
            },
          })}
        />
      )}
    </Box>
  );
}
