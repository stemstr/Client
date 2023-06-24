import { Avatar, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useUser } from "ndk/hooks/useUser";

type ProfilePicProps = {
  pubkey: string;
};

export default function ProfilePic({ pubkey }: ProfilePicProps) {
  const user = useUser(pubkey);
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.xs}px`);
  const size = isDesktop ? 100 : 64;

  return (
    <Avatar
      src={user?.profile?.image}
      alt={user?.profile?.name}
      size={size}
      radius={size / 2}
      mt={-size / 2}
    />
  );
}
