import { Button, Space, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChevronRightIcon } from "../../icons/StemstrIcon";
import AboutFieldGroup from "../FieldGroups/AboutFieldGroup";
import DisplayNameFieldGroup from "../FieldGroups/DisplayNameFieldGroup";
import LNURLFieldGroup from "../FieldGroups/LNURLFieldGroup";
import NameFieldGroup from "../FieldGroups/NameFieldGroup";
import BannerSelector from "../Fields/BannerSelector/BannerSelector";
import ProfilePicSelector from "../Fields/ProfilePicSelector/ProfilePicSelector";
import { useState } from "react";

export default function SignupForm({ handleSubmit }) {
  const form = useForm({
    initialValues: {
      banner: "",
      picture: "",
      display_name: "",
      name: "",
      about: "",
      //   lnurl: "",
    },
    validate: {},
  });
  const [bannerIsUploading, setBannerIsUploading] = useState(false);
  const [profilePicIsUploading, setProfilePicIsUploading] = useState(false);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <BannerSelector
        isUploading={bannerIsUploading}
        setIsUploading={setBannerIsUploading}
        {...form.getInputProps("banner")}
      />
      <ProfilePicSelector
        isUploading={profilePicIsUploading}
        setIsUploading={setProfilePicIsUploading}
        {...form.getInputProps("picture")}
      />
      <Space h={32} />
      <Stack spacing="md">
        <DisplayNameFieldGroup {...form.getInputProps("display_name")} />
        <NameFieldGroup {...form.getInputProps("name")} />
        <AboutFieldGroup {...form.getInputProps("about")} />
        {/* <LNURLFieldGroup {...form.getInputProps("lnurl")} /> */}
        <Space h={32} />
        <Button
          disabled={bannerIsUploading || profilePicIsUploading}
          type="submit"
        >
          Sign me up and generate keys{" "}
          <ChevronRightIcon width={16} height={16} />
        </Button>
      </Stack>
    </form>
  );
}
