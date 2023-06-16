import { Box, Center, Group, Image, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import BackButton from "components/BackButton/BackButton";
import BannerSelector from "components/EditProfileForm/BannerSelector";
import LNURLField from "components/EditProfileForm/LNURLField";
import NameFieldGroup from "components/EditProfileForm/NameFieldGroup";
import Nip05FieldGroup from "components/EditProfileForm/Nip05FieldGroup";
import ProfilePicSelector from "components/EditProfileForm/ProfilePicSelector";
import UsernameFieldGroup from "components/EditProfileForm/UsernameFieldGroup";
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
      nip05: "",
      about: "",
      lnurl: "",
    },
    validate: {},
  });

  useEffect(() => {
    if (user?.profile) {
      console.log(user.profile);
      form.setValues({
        banner: user.profile.banner,
        picture: user.profile.image,
        display_name: user.profile.displayName,
        name: user.profile.name ? `@${user.profile.name}` : "",
        nip05: user.profile.nip05,
        about: user.profile.about,
        lnurl: user.profile.lud06
          ? user.profile.lud06
          : user.profile.lud16
          ? user.profile.lud16
          : undefined,
      });
    }
  }, [user?.profile]);

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
        <Center
          sx={(theme) => ({
            marginBottom: theme.fn.largerThan("xs") ? 24 : 16,
          })}
        >
          <ProfilePicSelector {...form.getInputProps("picture")} />
        </Center>
        <Stack spacing="md">
          <NameFieldGroup {...form.getInputProps("display_name")} />
          <UsernameFieldGroup {...form.getInputProps("name")} />
          <Nip05FieldGroup {...form.getInputProps("nip05")} />
          <LNURLField />
        </Stack>
      </Box>
    </>
  );
}
