import { Box, Button, Center, Group, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { NDKEvent, NDKUserProfile } from "@nostr-dev-kit/ndk";
import BackButton from "components/BackButton/BackButton";
import BannerSelector from "components/EditProfileForm/BannerSelector";
import LNURLFieldGroup from "components/EditProfileForm/LNURLFieldGroup";
import NameFieldGroup from "components/EditProfileForm/NameFieldGroup";
import Nip05FieldGroup from "components/EditProfileForm/Nip05FieldGroup";
import ProfilePicSelector from "components/EditProfileForm/ProfilePicSelector";
import UsernameFieldGroup from "components/EditProfileForm/UsernameFieldGroup";
import { Route } from "enums";
import { CheckIcon, ChevronLeftIcon } from "icons/StemstrIcon";
import { useNDK } from "ndk/NDKProvider";
import { useUser } from "ndk/hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";
import { Kind } from "nostr-tools";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "store/Auth";

export default function EditProfile() {
  const { ndk } = useNDK();
  const router = useRouter();
  const authState = useSelector(selectAuthState);
  const user = useUser(authState.pk);
  const initialFormValues: NDKUserProfile = {
    name: "",
    displayName: "",
    image: "",
    banner: "",
    bio: "",
    nip05: "",
    lud06: "",
    lud16: "",
    about: "",
    zapService: "",
  };
  const form = useForm({
    initialValues: initialFormValues,
    validate: {},
  });

  useEffect(() => {
    if (user?.profile) {
      form.setValues({
        name: user.profile.name || "",
        displayName: user.profile.displayName || "",
        image: user.profile.image || "",
        banner: user.profile.banner || "",
        bio: user.profile.bio || "",
        nip05: user.profile.nip05 || "",
        lud06: user.profile.lud06 || "",
        lud16: user.profile.lud16 || "",
        about: user.profile.about || "",
        zapService: user.profile.zapService || "",
      });
    }
  }, [user?.profile]);

  const submitForm = () => {
    if (!authState.pk) return;

    const content: any = {};
    Object.entries(form.values).forEach(([key, value]) => {
      if (!value) return;
      switch (key) {
        case "displayName":
          content.display_name = value;
          break;
        case "image":
          content.picture = value;
          break;
        default:
          content[key] = value;
          break;
      }
    });

    const event: NDKEvent = new NDKEvent(ndk);
    event.kind = Kind.Metadata;
    event.pubkey = authState.pk;
    event.created_at = Math.floor(Date.now() / 1000);
    event.content = JSON.stringify(content);
    event.tags = [];
    // publish new profile
    event.publish().then(() => {
      showNotification({
        title: "Profile updated",
        message: "Your profile was updated successfully!",
      });
      // update cached profile
      ndk?.cacheAdapter?.setEvent(event, { authors: [event.pubkey] });
      // navigate back to profile page
      router.push(Route.Profile);
    });
  };

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
          <ProfilePicSelector {...form.getInputProps("image")} />
        </Center>
        <Stack spacing="md">
          <NameFieldGroup {...form.getInputProps("displayName")} />
          <UsernameFieldGroup {...form.getInputProps("name")} />
          <Nip05FieldGroup {...form.getInputProps("nip05")} />
          <LNURLFieldGroup form={form} />
          <Button
            onClick={submitForm}
            leftIcon={<CheckIcon width={14} height={14} />}
            sx={(theme) => ({
              [`${theme.fn.largerThan("xs")}`]: {
                width: "fit-content",
              },
            })}
          >
            Save Changes
          </Button>
        </Stack>
      </Box>
    </>
  );
}
