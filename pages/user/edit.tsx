import { Box, Group, Image, Text } from "@mantine/core";
import BackButton from "components/BackButton/BackButton";
import { Route } from "enums";
import { ChevronLeftIcon } from "icons/StemstrIcon";
import { useUser } from "ndk/hooks/useUser";
import Head from "next/head";
import { useSelector } from "react-redux";
import { selectAuthState } from "store/Auth";

export default function EditProfile() {
  const authState = useSelector(selectAuthState);
  const user = useUser(authState.pk);

  return (
    <>
      <Head>
        <title>{`Stemstr - Edit Profile`}</title>
      </Head>
      <Box
        sx={(theme) => ({
          padding: `${theme.spacing.md}px ${theme.spacing.md}px 0`,
          height: 200,
        })}
      >
        {user?.profile?.banner && (
          <Image
            src={user.profile.banner}
            height={200}
            styles={(theme) => ({
              root: {
                filter: "brightness(0.7)",
                position: "absolute",
                zIndex: -1,
                top: 0,
                left: 0,
                right: 0,
              },
              imageWrapper: {
                position: "static",
              },
            })}
          />
        )}
        <Group position="apart">
          <Group spacing="sm" align="center" c="white">
            <BackButton defaultUrl={Route.Profile}>
              <ChevronLeftIcon width={24} height={24} />
            </BackButton>
            <Text c="white" fw="bold" fz={24} lh="normal">
              Edit Profile
            </Text>
          </Group>
        </Group>
      </Box>
    </>
  );
}
