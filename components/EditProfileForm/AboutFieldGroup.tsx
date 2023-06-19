import FieldGroup from "components/FieldGroups/FieldGroup";
import useStyles from "./EditProfileForm.styles";
import { AlignLeftIcon } from "icons/StemstrIcon";
import { Textarea } from "@mantine/core";

export default function AboutFieldGroup(props: any) {
  const { classes } = useStyles();

  return (
    <FieldGroup
      TitleIcon={AlignLeftIcon}
      title="Bio"
      titleFontSize="sm"
      iconSize={16}
    >
      <Textarea
        autosize
        placeholder="Tell the world a lil' something"
        classNames={{
          input: classes.textInput,
        }}
        {...props}
      ></Textarea>
    </FieldGroup>
  );
}
