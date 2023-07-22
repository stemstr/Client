import { DrawerProps } from "components/Drawer/Drawer";
import SubscribeDrawer from "./SubscribeDrawer";
import { Button, Text } from "@mantine/core";

type SubscribeIntroDrawerProps = DrawerProps & {
  onContinue: () => void;
};

export default function SubscribeIntroDrawer({
  opened,
  onClose,
  onContinue,
  ...rest
}: SubscribeIntroDrawerProps) {
  return (
    <SubscribeDrawer opened={opened} onClose={onClose} {...rest}>
      <Text c="white" ta="center" fz={24} fw="bold" mt={8}>
        Stemstr Share Pass
      </Text>
      <Text c="white" ta="center" fz={20} fw={500} mt="xl">
        Gain access to unlimited sharing of sounds and commenting on Stemstr
      </Text>
      <Text ta="center" fz="md" mt="sm">
        Purchasing a pass helps to kee the quality of content on Stemstr at it's
        highest level and also limits any spam on the service.
      </Text>
      <Button
        onClick={onContinue}
        mt={64}
        fullWidth
        sx={(theme) => ({
          backgroundColor: theme.colors.green[5],
          "&:hover": {
            backgroundColor: theme.colors.green[8],
          },
        })}
      >
        Explore passes starting at 100 sats (~$0.02)
      </Button>
    </SubscribeDrawer>
  );
}
