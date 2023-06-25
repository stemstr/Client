import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAuthState } from "store/Auth";
import { Route } from "enums";

export default function useGuardAuth() {
  const router = useRouter();
  const auth = useSelector(selectAuthState);
  const isAuthenticated = useMemo(() => Boolean(auth.type), [auth.type]);

  const guardAuth = useCallback((): boolean => {
    if (!isAuthenticated) router.push(Route.Login);
    return isAuthenticated;
  }, [auth.type]);

  return { guardAuth, isAuthenticated };
}
