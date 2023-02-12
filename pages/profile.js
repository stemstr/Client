import { Router, useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "../store/Auth";

export default function Profile() {
  const router = useRouter();
  const authState = useSelector(selectAuthState);
  useEffect(() => {
    if (authState?.user?.pk) {
      router.replace(`/user/${authState.user.pk}`);
    } else {
      router.replace("/login");
    }
  }, [authState]);
  return <></>;
}
