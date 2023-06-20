import FieldGroup from "components/FieldGroups/FieldGroup";
import useStyles from "./EditProfileForm.styles";
import { WalletIcon } from "icons/StemstrIcon";
import { TextInput } from "@mantine/core";
import { ChangeEvent, useMemo } from "react";
import { UseFormReturnType } from "@mantine/form";
import { NDKUserProfile } from "@nostr-dev-kit/ndk";
import { isValidLUD16 } from "utils/lightning";

type LNURLFieldProps = {
  form: UseFormReturnType<
    NDKUserProfile,
    (values: NDKUserProfile) => NDKUserProfile
  >;
};

export default function LNURLField({ form }: LNURLFieldProps) {
  const { classes } = useStyles();
  const lud06Props = useMemo(() => form.getInputProps("lud06"), [form]);
  const lud16Props = useMemo(() => form.getInputProps("lud16"), [form]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let val = event.target.value;
    if (isValidLUD16(val)) {
      lud06Props.onChange("");
      lud16Props.onChange(val);
    } else {
      lud06Props.onChange(val);
      lud16Props.onChange("");
    }
  };

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
        {...(lud06Props.value ? lud06Props : lud16Props)}
        onChange={handleChange}
      />
    </FieldGroup>
  );
}
