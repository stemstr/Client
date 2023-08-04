import {
  Box,
  Center,
  FileInput,
  Image,
  Loader,
  TextInput,
} from "@mantine/core";
import { useRef } from "react";
import { CameraPlusIcon } from "../../../icons/StemstrIcon";
import { uploadImage } from "../../../utils/media";

export default function BannerSelector({
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
          height: 169,
          backgroundColor: theme.colors.gray[6],
          margin: `-${theme.spacing.md}px -${theme.spacing.md}px 0`,
          padding: `${theme.spacing.md}px ${theme.spacing.md}px 0`,
          fontSize: theme.fontSizes.xs,
          color: theme.white,
          position: "relative",
          cursor: "pointer",
          border: "1px dashed transparent",
          transition: "border-color .3s ease-in-out",
          ":hover": {
            borderColor: theme.white,
          },
        })}
      >
        {rest.value && (
          <Image
            src={rest.value}
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
        {!rest.value && (
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
            opacity: rest.value ? 0.5 : undefined,
          })}
        >
          {isUploading ? (
            <Loader size={20} />
          ) : (
            <CameraPlusIcon width={20} height={20} />
          )}
        </Box>
      </Box>
    </>
  );
}
