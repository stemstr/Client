import { Group, Text } from "@mantine/core";
import { motion, useAnimation } from "framer-motion";
import { useSelector } from "react-redux";
import { HeartIcon } from "../../icons/StemstrIcon";
import requireAuth from "../../utils/hoc/requireAuth";
import NoteAction from "./NoteAction";
import { Note } from "ndk/types/note";
import { selectAuthState } from "store/Auth";

const NoteActionLike = ({
  note,
  onClick,
  likedByCurrentUser,
}: {
  note: Note;
  onClick: React.MouseEvent<HTMLButtonElement>;
  likedByCurrentUser: boolean;
}) => {
  const controls = useAnimation();
  const auth = useSelector(selectAuthState);

  return (
    <NoteAction onClick={onClick}>
      <Group
        position="center"
        spacing={6}
        sx={(theme) => ({
          transition: "color 1s ease",
          color: likedByCurrentUser
            ? theme.colors.red[5]
            : theme.colors.gray[1],
        })}
      >
        <motion.span animate={controls} style={{ lineHeight: 0 }}>
          <HeartIcon width={18} height={18} />
        </motion.span>{" "}
        <Text lh="normal">
          {note.reactions.length > 0 && note.event.pubkey === auth.pk
            ? note.reactions.length
            : ""}
        </Text>
      </Group>
    </NoteAction>
  );
};

export default requireAuth(NoteActionLike);
