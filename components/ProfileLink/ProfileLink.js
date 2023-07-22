import { Avatar } from "@mantine/core";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ProfileIcon } from "../../icons/StemstrIcon";
import { selectAuthState } from "../../store/Auth";
import { useUser } from "ndk/hooks/useUser";

export default function ProfileLink({ size = 36 }) {
  const authState = useSelector(selectAuthState);
  const user = useUser(authState.pk);

  return (
    <Link href="/profile">
      <Avatar
        src={user?.profile?.image}
        alt={user?.profile?.name}
        size={size}
        radius="50%"
      >
        <ProfileIcon />
      </Avatar>
    </Link>
  );
}
