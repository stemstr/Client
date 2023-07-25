import { DrawerProps } from "components/Drawer/Drawer";
import SubscribeDrawer from "./SubscribeDrawer";
import { Button, Center, Group, Image, Text } from "@mantine/core";
import { useSubscribeWizard } from "./SubscribeWizardProvider";
import { ArrowRightIcon, CheckIcon } from "icons/StemstrIcon";
import ProfileLink from "components/ProfileLink/ProfileLink";

type SubscribePaymentCompleteDrawerProps = DrawerProps & {
  onClose: () => void;
};

export default function SubscribePaymentCompleteDrawer({
  opened,
  onClose,
  ...rest
}: SubscribePaymentCompleteDrawerProps) {
  const { selectedPassOption } = useSubscribeWizard();

  if (!selectedPassOption) return null;

  return (
    <SubscribeDrawer opened={opened} onClose={onClose} {...rest}>
      <Text c="white" ta="center" fz={24} fw="bold" mt={8}>
        You're on your way!
      </Text>
      <Group spacing={4} mt="xl">
        <ProfileLink size={44} />
        <ArrowRightIcon />
        <Image src="/logo.svg" width={44} />
      </Group>
      <Text c="white" fz={20} fw="bold" mt="md">
        {selectedPassOption.priceSATS.toLocaleString()} sats
      </Text>
      <Text color="green.6" fz={48} fw="bold">
        {selectedPassOption.numDays} days
      </Text>
      <Group spacing={10} mt="md">
        <Center
          w={36}
          h={36}
          c="green.5"
          sx={(theme) => ({
            border: "2px solid",
            borderRadius: "50%",
            backgroundColor: theme.fn.rgba(theme.colors.green[5], 0.15),
          })}
        >
          <CheckIcon />
        </Center>
        <Text fw="bold">Payment successful</Text>
      </Group>
      <Text mt={40}>
        You're good to go! Once your time is up, you can pay again to regain
        access to sharing and commenting on Stemstr.
      </Text>
      <Button onClick={onClose} mt={96} fullWidth>
        Let's go!
      </Button>
    </SubscribeDrawer>
  );
}
