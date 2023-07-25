import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAuthState } from "store/Auth";
import { Route } from "enums";

export default function useAuth() {
  const router = useRouter();
  const authState = useSelector(selectAuthState);
  const isAuthenticated = useMemo(
    () => Boolean(authState.type),
    [authState.type]
  );

  const guardAuth = useCallback(
    (redirectUrl = Route.Login): boolean => {
      if (!isAuthenticated) router.push(redirectUrl);
      return isAuthenticated;
    },
    [authState.type]
  );

  const isSubscribed = useCallback(() => {
    if (!authState.subscriptionStatus?.expires_at) return false;
    return Date.now() < authState.subscriptionStatus.expires_at;
  }, [authState.subscriptionStatus?.expires_at]);

  return { authState, guardAuth, isAuthenticated, isSubscribed };
}
