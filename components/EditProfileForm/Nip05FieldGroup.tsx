import FieldGroup from "components/FieldGroups/FieldGroup";
import useStyles from "./EditProfileForm.styles";
import { CheckVerifiedIcon } from "icons/StemstrIcon";
import { TextInput } from "@mantine/core";

export default function Nip05FieldGroup(props: any) {
  const { classes } = useStyles();

  return (
    <FieldGroup
      TitleIcon={CheckVerifiedIcon}
      title="nostr verification"
      titleFontSize="sm"
      iconSize={16}
    >
      <TextInput
        placeholder="name@example.com"
        classNames={{
          input: classes.textInput,
        }}
        {...props}
      />
    </FieldGroup>
  );
}
