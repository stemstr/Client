import { Box, Center } from "@mantine/core";
import ProfileLink from "components/ProfileLink/ProfileLink";
import useAuth from "hooks/useAuth";
import { PremiumIcon } from "icons/StemstrIcon";

export default function ProfileMenu() {
  const { isSubscribed } = useAuth();
  const premiumGradient = "linear-gradient(135deg, #09D4B0 0%, #2F9AF8 100%)";

  return (
    <>
      <Box
        sx={(theme) => ({
          padding: 3,
          borderRadius: 22,
          backgroundColor: theme.colors.gray[4],
        })}
      >
        <Box
          pos="relative"
          p={1}
          sx={(theme) => ({
            backgroundColor: theme.colors.gray[8],
            background: isSubscribed() ? premiumGradient : undefined,
            borderRadius: 19,
          })}
        >
          <ProfileLink size={36} />
          {isSubscribed() && (
            <Center
              pos="absolute"
              top={0}
              left={-3}
              p={3}
              sx={(theme) => ({
                borderRadius: "50%",
                border: "1px solid",
                color: theme.colors.dark[7],
                background: premiumGradient,
              })}
            >
              <PremiumIcon width={10} height={10} />
            </Center>
          )}
        </Box>
      </Box>
    </>
  );
}
