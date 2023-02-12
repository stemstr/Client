import { useProfile } from "nostr-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthState, setAuthUser } from "./Auth";
import NostrAuthStateProvider from "./NostrAuthStateProvider";

export default function NostrStateProvider({ children }) {
  const authState = useSelector(selectAuthState);
  //   const dispatch = useDispatch();
  //   const { data: userData } = useProfile({
  //     pubkey: authState?.user?.pk ?? null,
  //   });

  //   useEffect(() => {
  //     if (userData?.npub) {
  //       dispatch(setAuthUser(userData));
  //     }
  //   }, [userData?.npub]);

  return (
    <>
      {authState?.user?.pk ? (
        <NostrAuthStateProvider pk={authState.user.pk} />
      ) : null}
      {children}
    </>
  );
}
