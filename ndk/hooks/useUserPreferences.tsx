import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectNip78State } from "../../store/Nip78";
import { useNDK } from "../NDKProvider";
import { NDKEvent, NDKKind } from "@nostr-dev-kit/ndk";
import useCurrentUser from "../../hooks/useCurrentUser";
import {
  setUserPreferences,
  setHasCompletedInitialFetch,
} from "../../store/Nip78";

export default function useUserPreferences() {
  const { ndk, stemstrRelaySet } = useNDK();
  const { userPreferences, hasCompletedInitialFetch } =
    useSelector(selectNip78State);
  const dispatch = useDispatch();
  const currentUser = useCurrentUser();
  const isFetching = useRef(false);

  useEffect(() => {
    if (
      hasCompletedInitialFetch ||
      !ndk ||
      !currentUser ||
      isFetching.current
    ) {
      return;
    }

    isFetching.current = true;

    const storeNip78State = async (event: NDKEvent) => {
      if (!ndk?.signer || !currentUser) {
        return;
      }

      try {
        dispatch(setHasCompletedInitialFetch(true));
        dispatch(
          setUserPreferences(
            JSON.parse(await ndk.signer.decrypt(currentUser, event.content))
          )
        );
      } catch (error) {
        console.error(error);
      }
    };

    ndk
      .fetchEvent(
        {
          kinds: [NDKKind.AppSpecificData],
          authors: [currentUser.hexpubkey()],
        },
        {},
        // @ts-expect-error TODO: remove this type is fixed NDK https://github.com/nostr-dev-kit/ndk/issues/51
        stemstrRelaySet
      )
      .then((event: NDKEvent | null) => {
        if (event) {
          return storeNip78State(event);
        }
      })
      .catch(console.error)
      .finally(() => {
        isFetching.current = false;
      });
  }, [hasCompletedInitialFetch, ndk, currentUser, stemstrRelaySet, dispatch]);

  return userPreferences;
}
