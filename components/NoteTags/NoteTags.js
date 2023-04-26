import { Chip, Group } from "@mantine/core";
import withStopClickPropagation from "../../utils/hoc/withStopClickPropagation";

const NoteTags = ({ note, classes, ...rest }) => {
  return (
    <Group position="left" {...rest}>
      {note.event?.tags
        ?.filter((tag) => tag[0] == "t")
        .map((tag, index) => (
          <Chip radius="md" key={index} className={classes.tag}>
            #{tag[1]}
          </Chip>
        ))}
    </Group>
  );
};

export default withStopClickPropagation(NoteTags);
