import { Text } from "@mantine/core";
import LNURLField from "../Fields/LNURLField/LNURLField";
import FieldGroup from "./FieldGroup";

export default function LNURLFieldGroup(props) {
  return (
    <FieldGroup title="Bitcoin lightning tips" titleFontSize="xs">
      <LNURLField {...props} />
      <Text
        fz="xs"
        sx={(theme) => ({ color: theme.fn.rgba(theme.white, 0.4) })}
      >
        Add your Lightning Address to receive tips from others
      </Text>
    </FieldGroup>
  );
}
