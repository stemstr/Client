import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCachedAuth } from "../cache/cache";
import { selectAuthState, setAuthState } from "./Auth";
import NostrAuthStateProvider from "./NostrAuthStateProvider";

export default function NostrStateProvider({ children }) {
  const dispatch = useDispatch();

  const authState = useSelector(selectAuthState);

  useEffect(() => {
    // console.log(authState);
  }, [authState]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedAuth = getCachedAuth();
      dispatch(setAuthState(cachedAuth));
    }
  }, []);

  return (
    <>
      {authState?.user?.pk && <NostrAuthStateProvider pk={authState.user.pk} />}
      {children}
    </>
  );
}
