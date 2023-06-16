import { TextInput } from "@mantine/core";
import useStyles from "components/EditProfileForm/EditProfileForm.styles";
import FieldGroup from "components/FieldGroups/FieldGroup";
import { ProfileIcon } from "icons/StemstrIcon";

export default function NameFieldGroup(props: any) {
  const { classes } = useStyles();

  return (
    <FieldGroup
      TitleIcon={ProfileIcon}
      title="Your name"
      titleFontSize="sm"
      iconSize={16}
    >
      <TextInput
        placeholder="What do you want to be called?"
        classNames={{
          input: classes.textInput,
        }}
        {...props}
      />
    </FieldGroup>
  );
}
