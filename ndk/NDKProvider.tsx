import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import NDK, {
  NDKNip07Signer,
  NDKPrivateKeySigner,
  NDKRelay,
  NDKRelaySet,
} from "@nostr-dev-kit/ndk";
import { useDispatch, useSelector } from "react-redux";
import { isAuthState, selectAuthState, setAuthState } from "store/Auth";
import { getCachedAuth } from "cache/cache";

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
  const dispatch = useDispatch();
  const authState = useSelector(selectAuthState);
  const [ndk, setNDK] = useState<NDK | undefined>(undefined);
  const [stemstrRelaySet, setStemstrRelaySet] = useState<
    NDKRelaySet | undefined
  >(undefined);

  // Initialize NDK instance on component mount
  useEffect(() => {
    const initNDK = async () => {
      const ndkInstance = new NDK({ explicitRelayUrls });

      // Connect to the relays
      await ndkInstance.connect();

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
    if (ndk) {
      let signer;
      switch (authState.type) {
        case "privatekey":
          signer = new NDKPrivateKeySigner(authState.sk);
          break;
        case "nip07":
          signer = new NDKNip07Signer();
          break;
        default:
          break;
      }
      ndk.signer = signer;
    }
  }, [ndk, authState.type, authState.sk, authState.pk]);

  useEffect(() => {
    const auth = getCachedAuth();
    if (isAuthState(auth)) {
      dispatch(setAuthState(auth));
    }
  }, []);

  // Return the provider with the NDK instance
  return (
    <NDKContext.Provider
      value={{ ndk, stemstrRelaySet, canPublishEvents: !!ndk?.signer }}
    >
      {ndk ? children : "Loading..."}
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
