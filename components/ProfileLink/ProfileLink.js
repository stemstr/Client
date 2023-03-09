import { Avatar } from "@mantine/core";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ProfileIcon } from "../../icons/StemstrIcon";
import { selectAuthState } from "../../store/Auth";

export default function ProfileLink() {
  const authState = useSelector(selectAuthState);

  return (
    <Link href="/profile">
      <Avatar
        src={authState?.user?.picture}
        alt={authState?.user?.name}
        size={36}
        radius="50%"
      >
        <ProfileIcon />
      </Avatar>
    </Link>
  );
}
