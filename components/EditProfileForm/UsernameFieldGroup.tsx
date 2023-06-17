import { TextInput } from "@mantine/core";
import useStyles from "./EditProfileForm.styles";
import FieldGroup from "components/FieldGroups/FieldGroup";
import { AtSignIcon } from "icons/StemstrIcon";
import { ChangeEvent } from "react";

export default function UsernameFieldGroup({ onChange, value, ...rest }: any) {
  const { classes } = useStyles();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let val = event.target.value;
    if (val.startsWith("@")) val = val.slice(1);
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
        placeholder="entercrazywildnamehere"
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
        value={`${value}`}
        icon={
          <AtSignIcon
            width={16}
            height={16}
            color={value ? "white" : "#5C5F66"}
          />
        }
      />
    </FieldGroup>
  );
}
