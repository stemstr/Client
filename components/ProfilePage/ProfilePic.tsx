import { Avatar, Box, Center, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import useAuth from "hooks/useAuth";
import { PremiumIcon } from "icons/StemstrIcon";
import useProfilePicSrc from "ndk/hooks/useProfilePicSrc";
import { useUser } from "ndk/hooks/useUser";

type ProfilePicProps = {
  pubkey: string;
  size?: number;
};

export default function ProfilePic({ pubkey, size }: ProfilePicProps) {
  const { authState, isSubscribed } = useAuth();
  const user = useUser(pubkey);
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.xs}px`);
  const renderedSize = size ? size : isDesktop ? 100 : 64;
  const src = useProfilePicSrc(user);
  const premiumGradient = "linear-gradient(135deg, #09D4B0 0%, #2F9AF8 100%)";
  const shouldHighlight = isSubscribed() && pubkey === authState.pk;

  return (
    <Box
      pos="relative"
      w={renderedSize}
      h={renderedSize}
      p={3}
      mt={-renderedSize / 2}
      sx={(theme) => ({
        backgroundColor: theme.colors.gray[8],
        background: shouldHighlight ? premiumGradient : undefined,
        borderRadius: renderedSize / 2,
        boxShadow: "0px 0px 0px 3px rgba(150, 188, 229, 0.12)",
      })}
    >
      <Avatar
        src={user?.profile?.image || src}
        alt={user?.profile?.name}
        size={renderedSize - 6}
        radius={(renderedSize - 6) / 2}
      />
      {shouldHighlight && (
        <Center
          pos="absolute"
          top={0}
          left={0}
          p={4}
          sx={(theme) => ({
            borderRadius: "50%",
            border: "1px solid",
            color: theme.colors.dark[7],
            background: premiumGradient,
          })}
        >
          <PremiumIcon width={renderedSize / 6} height={renderedSize / 6} />
        </Center>
      )}
    </Box>
  );
}
