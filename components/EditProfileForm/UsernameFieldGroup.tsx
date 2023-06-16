import { TextInput } from "@mantine/core";
import useStyles from "components/EditProfileForm/EditProfileForm.styles";
import FieldGroup from "components/FieldGroups/FieldGroup";
import { AtSignIcon } from "icons/StemstrIcon";
import { ChangeEvent } from "react";

export default function UsernameFieldGroup({ onChange, ...rest }: any) {
  const { classes } = useStyles();
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let val = event.target.value;
    if (val && !val.startsWith("@")) val = `@${val}`;
    onChange(val);
  };

  return (
    <FieldGroup
      TitleIcon={AtSignIcon}
      title="Username"
      titleFontSize="sm"
      iconSize={16}
    >
      <TextInput
        placeholder="@entercrazywildnamehere"
        classNames={{
          input: classes.textInput,
        }}
        styles={(theme) => ({
          input: {
            backgroundColor: theme.colors.dark[7],
            padding: theme.spacing.md,
            borderRadius: theme.radius.md,
            border: `1px solid ${theme.colors.gray[4]}`,
            fontSize: theme.fontSizes.md,
            color: theme.white,
          },
        })}
        {...rest}
        onChange={handleChange}
      />
    </FieldGroup>
  );
}
