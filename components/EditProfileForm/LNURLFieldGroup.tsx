import FieldGroup from "components/FieldGroups/FieldGroup";
import useStyles from "./EditProfileForm.styles";
import { WalletIcon } from "icons/StemstrIcon";
import { TextInput } from "@mantine/core";

export default function LNURLField(props: any) {
  const { classes } = useStyles();

  return (
    <FieldGroup
      TitleIcon={WalletIcon}
      title="Bitcoin lightning tips"
      titleFontSize="sm"
      iconSize={16}
    >
      <TextInput
        placeholder="LNURL or Lightning Address"
        classNames={{
          input: classes.textInput,
        }}
        {...props}
      />
    </FieldGroup>
  );
}
