import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import NDK, { NDKRelay, NDKRelaySet } from "@nostr-dev-kit/ndk";
import { useDispatch, useSelector } from "react-redux";
import {
  isAuthState,
  reset as logout,
  selectAuthState,
  setAuthState,
} from "store/Auth";
import { getCachedAuthState, getCachedSearchHistoryState } from "cache/cache";
import inMemoryCacheAdapter from "./inMemoryCacheAdapter";
import { createSigner } from "./utils";
import { useRouter } from "next/router";
import { Route } from "../enums";
import useLoadCache from "./hooks/useLoadCache";
import { setSearchHistoryState } from "store/SearchHistory";

interface NDKContext {
  ndk?: NDK;
  stemstrRelaySet?: NDKRelaySet;
  canPublishEvents: boolean;
}

// Create a context to store the NDK instance
const NDKContext = createContext<NDKContext>({ canPublishEvents: false });

// NDKProvider function component
const NDKProvider = ({
  explicitRelayUrls,
  children,
}: PropsWithChildren<{ explicitRelayUrls: string[] }>) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector(selectAuthState);
  const [ndk, setNDK] = useState<NDK | undefined>(undefined);
  const [stemstrRelaySet, setStemstrRelaySet] = useState<
    NDKRelaySet | undefined
  >(undefined);
  const [canPublishEvents, setCanPublishEvents] = useState(false);
  useLoadCache(ndk);

  // Initialize NDK instance on component mount
  useEffect(() => {
    const initNDK = async () => {
      const ndkInstance = new NDK({
        explicitRelayUrls,
        cacheAdapter: inMemoryCacheAdapter,
      });

      try {
        // Connect to the relays
        await ndkInstance.connect();
      } catch (error) {
        console.error(error);
      }

      // Set the NDK instance in the state
      setNDK(ndkInstance);
    };

    initNDK();
  }, [explicitRelayUrls, setNDK]);

  useEffect(() => {
    if (ndk) {
      const relays: Set<NDKRelay> = new Set();
      relays.add(
        ndk.pool?.relays.get(
          process.env.NEXT_PUBLIC_STEMSTR_RELAY as string
        ) as NDKRelay
      );
      const relaySet = new NDKRelaySet(relays, ndk);
      setStemstrRelaySet(relaySet);
    }
  }, [ndk, setStemstrRelaySet]);

  useEffect(() => {
    const isAuthenticated = Boolean(authState.type);

    if (ndk && isAuthenticated) {
      createSigner(authState)
        .then((signer) => {
          ndk.signer = signer;
          setCanPublishEvents(!!ndk?.signer);
        })
        .catch((error) => {
          console.error(error);
          dispatch(logout());
          router.push(Route.Login);
        });
    }
  }, [ndk, authState, dispatch, router]);

  useEffect(() => {
    const authState = getCachedAuthState();
    if (isAuthState(authState)) {
      dispatch(setAuthState(authState));
    }
    const searchHistoryState = getCachedSearchHistoryState();
    dispatch(setSearchHistoryState(searchHistoryState));
  }, [dispatch]);

  // Return the provider with the NDK instance
  return (
    <NDKContext.Provider value={{ ndk, stemstrRelaySet, canPublishEvents }}>
      {ndk ? children : null}
    </NDKContext.Provider>
  );
};

// Custom hook to access NDK instance from the context
const useNDK = () => {
  const context = useContext(NDKContext);
  if (context === undefined) {
    throw new Error("useNDK must be used within an NDKProvider");
  }
  return context;
};

export { NDKProvider, useNDK };
