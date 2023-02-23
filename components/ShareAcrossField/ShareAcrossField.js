import { Group, Stack, Text } from "@mantine/core";
import StemstrSwitch from "../StemstrSwitch/StemstrSwitch";

export default function ShareAcrossField(props) {
  return (
    <Group position="apart" align="center">
      <Stack spacing={2}>
        <Text c="white" fz="sm">
          Share across nostr apps
        </Text>
        <Text c="gray.2" fz="xs">
          Change share options in{" "}
          <Text span underline>
            settings
          </Text>
        </Text>
      </Stack>
      <StemstrSwitch checked={props.value} {...props} />
    </Group>
  );
}
