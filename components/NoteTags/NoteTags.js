import { Chip, Group } from "@mantine/core";
import withStopClickPropagation from "../../utils/hoc/withStopClickPropagation";
import { useEvent } from "../../ndk/NDKEventProvider";
import { useRouter } from "next/router";
import { Route } from "../../enums";

const NoteTags = ({ classes, ...rest }) => {
  const { event } = useEvent();
  const router = useRouter();

  return (
    <Group
      position="left"
      spacing={12}
      sx={(theme) => ({
        [theme.fn.smallerThan("xs")]: {
          flexWrap: "nowrap",
          overflowX: "auto",
        },
      })}
      {...rest}
    >
      {event?.tags
        ?.filter((tag) => tag[0] == "t")
        .map((tag, index) => (
          <Chip
            radius="md"
            key={index}
            className={classes.tag}
            checked={false}
            onClick={() =>
              router.push({
                pathname: Route.Tag,
                query: { tag: tag[1] },
              })
            }
          >
            #{tag[1]}
          </Chip>
        ))}
    </Group>
  );
};

export default withStopClickPropagation(NoteTags);
