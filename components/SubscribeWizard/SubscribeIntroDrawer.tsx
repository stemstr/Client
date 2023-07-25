import { DrawerProps } from "components/Drawer/Drawer";
import SubscribeDrawer from "./SubscribeDrawer";
import { Button, Image, Text } from "@mantine/core";

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
      <Text c="white" ta="center" fz={20} fw="bold" mt={8}>
        Stemstr Share Pass
      </Text>
      <Image
        src="/img/subscription-hero.png"
        height={212}
        fit="cover"
        mt="md"
        styles={{
          image: {
            borderRadius: 16,
          },
        }}
      />
      <Text c="white" ta="center" fz={18} fw={500} mt={28}>
        Gain access to unlimited sharing of sounds and commenting on Stemstr
      </Text>
      <Text ta="center" fz="sm" mt={8}>
        Purchasing a pass helps to kee the quality of content on Stemstr at it's
        highest level and also limits any spam on the service.
      </Text>
      <Button onClick={onContinue} mt={58} color="green" fullWidth>
        Explore passes starting at 100 sats (~$0.02)
      </Button>
    </SubscribeDrawer>
  );
}
