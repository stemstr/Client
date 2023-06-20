import {
  Box,
  Center,
  FileInput,
  Image,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { EditIcon } from "icons/StemstrIcon";
import { Dispatch, SetStateAction, useRef } from "react";
import { uploadImage } from "utils/media";

type BannerProps = {
  setIsUploading: Dispatch<SetStateAction<boolean>>;
};

export default function BannerSelector({ setIsUploading, ...rest }: any) {
  const inputRef = useRef<HTMLButtonElement>(null);
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.xs}px`);
  const height = isDesktop ? 200 : 170;

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
    <Box
      onClick={handleSelectClick}
      sx={(theme) => ({
        height: height,
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
        <TextInput {...rest} />
        <FileInput
          accept="image/*"
          ref={inputRef}
          onChange={handleImageChange}
        />
      </Box>
      <Box
        pos="absolute"
        sx={(theme) => ({
          zIndex: 1,
          right: theme.spacing.md,
          bottom: theme.spacing.md,
          [`${theme.fn.largerThan("xs")}`]: {
            left: 0,
            right: 0,
            bottom: "unset",
          },
        })}
      >
        <Center mt={80}>
          <EditIcon
            width={isDesktop ? 26 : 20}
            height={isDesktop ? 26 : 20}
            color="white"
          />
        </Center>
      </Box>
      {rest.value && (
        <Image
          src={rest.value}
          height={height}
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
