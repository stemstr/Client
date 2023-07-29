import { MouseEvent } from "react";
import { Anchor, Box } from "@mantine/core";
import useStyles from "./NoteContent.styles";

export const HyperLink = ({ href }: { href: string }) => {
  const { classes } = useStyles();

  if (/(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(href)) {
    return (
      <Box w="fit-content" sx={{ maxHeight: 200, overflow: "hidden" }}>
        <img
          src={href}
          alt={href}
          style={{ maxWidth: "50%", borderRadius: 12 }}
        />
      </Box>
    );
  }

  return (
    <Anchor
      className={classes.anchor}
      href={href}
      onClick={(e: MouseEvent) => e.stopPropagation()}
      target="_blank"
      rel="noreferrer"
    >
      {href}
    </Anchor>
  );
};

export default HyperLink;
