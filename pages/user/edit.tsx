import { Box, Center, Group, Image, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import BackButton from "components/BackButton/BackButton";
import BannerSelector from "components/EditProfileForm/BannerSelector";
import ProfilePicSelector from "components/EditProfileForm/ProfilePicSelector";
import { Route } from "enums";
import { ChevronLeftIcon, EditIcon } from "icons/StemstrIcon";
import { useUser } from "ndk/hooks/useUser";
import Head from "next/head";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "store/Auth";

export default function EditProfile() {
  const authState = useSelector(selectAuthState);
  const user = useUser(authState.pk);
  const form = useForm({
    initialValues: {
      banner: "",
      picture: "",
      display_name: "",
      name: "",
      about: "",
      lnurl: "",
    },
    validate: {},
  });

  useEffect(() => {
    if (user) {
      form.setValues({
        banner: user.profile?.banner,
        picture: user.profile?.image,
        display_name: user.profile?.displayName,
        name: user.profile?.name,
        about: user.profile?.about,
        lnurl: user.profile?.lud06
          ? user.profile?.lud06
          : user.profile?.lud16
          ? user.profile?.lud16
          : undefined,
      });
    }
  }, [user?.profile?.image]);

  useEffect(() => {
    console.log(form.values);
  }, [form.values]);

  return (
    <>
      <Head>
        <title>Stemstr - Edit Profile</title>
      </Head>
      <Box
        sx={(theme) => ({
          padding: `${theme.spacing.md}px ${theme.spacing.md}px 0`,
        })}
      >
        <BannerSelector {...form.getInputProps("banner")} />
        <Group
          position="apart"
          sx={(theme) => ({
            position: "absolute",
            top: 0,
            zIndex: 2,
            paddingTop: `${theme.spacing.md}px`,
          })}
        >
          <Group spacing="sm" align="center" c="white">
            <BackButton defaultUrl={Route.Profile}>
              <ChevronLeftIcon width={24} height={24} />
            </BackButton>
            <Text c="white" fw="bold" fz={24} lh="normal">
              Edit Profile
            </Text>
          </Group>
        </Group>
        <Center>
          <ProfilePicSelector {...form.getInputProps("picture")} />
        </Center>
      </Box>
    </>
  );
}
