import {
  Button,
  List,
  MantineTheme,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Drawer from "components/Drawer/Drawer";

export default function TermsOfService() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        opened={opened}
        position="bottom"
        onClose={close}
        withCloseButton={false}
        onDragEnd={close}
        styles={(theme: MantineTheme) => ({
          overlay: {
            backgroundColor: `${theme.colors.dark[7]} !important`,
            backdropFilter: "blur(16px)",
            opacity: `${0.5} !important`,
          },
          drawer: {
            backgroundColor: theme.colors.dark[8],
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            maxWidth: 600,
            margin: "auto",
            padding: `0 16px 24px 16px !important`,
          },
        })}
      >
        <Text component="h2" c="white" align="center" fz={20}>
          Stemstr Community Guidelines
        </Text>
        <List type="unordered" c="gray.1" spacing="md" fz="sm" fw={500} mt={24}>
          <List.Item>
            All music shared to Stemstr will be made freely available for all to
            download and remix
          </List.Item>
          <List.Item>
            Only share music in which you have had a significant creative
            contribution
          </List.Item>
          <List.Item>
            Only share music that you have rights to release
          </List.Item>
          <List.Item>
            Do not share anything illegal or that can cause harm to another
            individual
          </List.Item>
        </List>
        <Text c="orange.5" fz="sm" fw="bold" align="center" mt="md">
          We may revoke your access to the Stemstr relay if you violate these
          guidelines.
        </Text>
        <Button onClick={close} color="green" mt={24} fullWidth>
          I Understand
        </Button>
      </Drawer>
      <Text fz="xs" c="gray.2" mt={8}>
        By logging in, you agree to the{" "}
        <UnstyledButton onClick={open} fz="xs" c="purple.5">
          terms of service
        </UnstyledButton>
      </Text>
    </>
  );
}
