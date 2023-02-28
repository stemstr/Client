import { Avatar, Button, Group, Image, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useProfile } from "../../nostr/hooks/useProfile";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cacheAuthState } from "../../cache/cache";
import { selectAuthState, reset as logout } from "../../store/Auth";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { pubkey } = router.query;
  const authState = useSelector(selectAuthState);
  const { data: userData } = useProfile({
    pubkey,
  });

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const handleLogout = () => {
    dispatch(logout());
    cacheAuthState(null);
    router.push("/login");
  };

  return (
    <>
      {userData?.banner ? <Image src={userData.banner} mb="lg" /> : null}
      <Group mb="lg">
        <Avatar
          src={userData?.picture}
          alt={userData?.name}
          size={42}
          radius="50%"
        />
        <Text size="lg" color="white">
          {userData?.display_name
            ? userData.display_name
            : `@${userData?.pk?.substring(0, 5)}...`}
        </Text>
        <Text>✅</Text>
        <Text size="xs" color="rgba(255, 255, 255, 0.74)">
          {userData?.name
            ? userData?.nip05
              ? userData.nip05
              : `@${userData.name}`
            : ""}
        </Text>
      </Group>
      <Text mb="lg">{userData?.about}</Text>
      {authState?.user?.npub === userData?.npub ? (
        <Button onClick={handleLogout}>Logout</Button>
      ) : null}
    </>
  );
}
