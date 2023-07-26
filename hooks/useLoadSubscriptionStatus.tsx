import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useAuth from "./useAuth";
import { fetchSubscriptionStatus, setSubscriptionStatus } from "store/Auth";

export default function useLoadSubscriptionStatus() {
  const { authState } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (authState.pk) {
      fetchSubscriptionStatus(authState.pk)
        .then((subscriptionStatus) => {
          console.log(subscriptionStatus);
          dispatch(setSubscriptionStatus(subscriptionStatus));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [authState.pk, dispatch]);
}
