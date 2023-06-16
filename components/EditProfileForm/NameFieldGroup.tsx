import { TextInput } from "@mantine/core";
import FieldGroup from "components/FieldGroups/FieldGroup";
import { ProfileIcon } from "icons/StemstrIcon";

export default function NameFieldGroup(props: any) {
  return (
    <FieldGroup
      TitleIcon={ProfileIcon}
      title="Your name"
      titleFontSize="sm"
      iconSize={16}
    >
      <TextInput
        placeholder="What do you want to be called?"
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
        {...props}
      />
    </FieldGroup>
  );
}
