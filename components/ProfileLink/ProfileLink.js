import { Avatar } from "@mantine/core";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ProfileIcon } from "../../icons/StemstrIcon";
import { selectAuthState } from "../../store/Auth";
import { useProfile } from "ndk/hooks/useProfile";

export default function ProfileLink() {
  const authState = useSelector(selectAuthState);
  const { data } = useProfile({ pubkey: authState.pk });

  return (
    <Link href="/profile">
      <Avatar src={data?.image} alt={data?.name} size={36} radius="50%">
        <ProfileIcon />
      </Avatar>
    </Link>
  );
}
