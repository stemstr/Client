import { Avatar, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import useProfilePicSrc from "ndk/hooks/useProfilePicSrc";
import { useUser } from "ndk/hooks/useUser";

type ProfilePicProps = {
  pubkey: string;
  size?: number;
};

export default function ProfilePic({ pubkey, size }: ProfilePicProps) {
  const user = useUser(pubkey);
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.xs}px`);
  const renderedSize = size ? size : isDesktop ? 100 : 64;
  const src = useProfilePicSrc(user);

  return (
    <Avatar
      src={user?.profile?.image || src}
      alt={user?.profile?.name}
      size={renderedSize}
      radius={renderedSize / 2}
      mt={-renderedSize / 2}
    />
  );
}
