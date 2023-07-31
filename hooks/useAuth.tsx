import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAuthState } from "store/Auth";
import { Route } from "enums";
import { useSubscribeWizard } from "components/SubscribeWizard/SubscribeWizardProvider";

export default function useAuth() {
  const router = useRouter();
  const authState = useSelector(selectAuthState);
  const { start: startSubscribeWizard } = useSubscribeWizard();
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
    return authState.subscriptionStatus.expires_at > Date.now() / 1000;
  }, [authState.subscriptionStatus?.expires_at]);

  const guardSubscribed = useCallback((): boolean => {
    if (!isSubscribed()) startSubscribeWizard();
    return isSubscribed();
  }, [authState.subscriptionStatus?.expires_at, startSubscribeWizard]);

  return {
    authState,
    guardAuth,
    isAuthenticated,
    guardSubscribed,
    isSubscribed,
  };
}
