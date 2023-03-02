import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Relay, Event as NostrEvent, relayInit } from "nostr-tools";
import { uniqBy, log } from "./utils";
import { relaysSlice } from "../store/Relays";

type OnConnectFunc = (relay: Relay) => void;
type OnDisconnectFunc = (relay: Relay) => void;

interface NostrContextType {
  isLoading: boolean;
  debug?: boolean;
  connectedRelays: Relay[];
  onConnect: (_onConnectCallback?: OnConnectFunc) => void;
  onDisconnect: (_onDisconnectCallback?: OnDisconnectFunc) => void;
  publish: (event: NostrEvent, relayUrls?: string[]) => void;
}

export const NostrContext = createContext<NostrContextType>({
  isLoading: true,
  connectedRelays: [],
  onConnect: () => null,
  onDisconnect: () => null,
  publish: () => null,
});

export default function NostrProvider({
  children,
  relayUrls,
  debug = false,
}: {
  children: ReactNode;
  relayUrls: string[];
  debug?: boolean;
}) {
  // const [isLoading, setIsLoading] = useState(true);
  const [relays, setRelays] = useState<Relay[]>([]);
  const [totalConnections, setTotalConnections] = useState<number>(0);
  const connectedRelays = useMemo(() => {
    return relays.filter((relay) => relay.status === 1);
  }, [relays.map((relay) => relay.status)]);
  const [isLoading, setIsLoading] = useState(true);

  let onConnectCallback: null | OnConnectFunc = null;
  let onDisconnectCallback: null | OnDisconnectFunc = null;

  const isFirstRender = useRef(true);

  const connectToRelays = useCallback(() => {
    relayUrls.forEach(async (relayUrl) => {
      // Check if the relay exists
      if (!relays.some((relay) => relay.url === relayUrl)) {
        // If not, create relay
        const relay = relayInit(relayUrl);
        setRelays((prev) => uniqBy([...prev, relay], "url"));
        relay.connect();

        relay.on("connect", () => {
          log(debug, "info", `✅ nostr (${relayUrl}): Connected!`);
          setIsLoading(false);
          setTotalConnections((total) => total + 1);
          onConnectCallback?.(relay);
        });

        relay.on("disconnect", () => {
          log(debug, "warn", `🚪 nostr (${relayUrl}): Connection closed.`);
          // setTimeout(() => relay.connect(), 3000);
          // setTotalConnections((total) => total - 1);
          onDisconnectCallback?.(relay);
        });

        relay.on("error", () => {
          log(debug, "error", `❌ nostr (${relayUrl}): Connection error!`);
          setTimeout(() => relay.connect(), 3000);
        });
      }
    });
  }, []);

  useEffect(() => {
    // console.log(isLoading, connectedRelays, totalConnections);
  }, [connectedRelays]);

  useEffect(() => {
    // Make sure we only start the relays once (even in strict-mode)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      connectToRelays();
    }
  }, []);

  const publish = (event: NostrEvent, relayUrls?: string[]) => {
    return connectedRelays
      .filter(
        (relay) => relayUrls === undefined || relayUrls?.includes(relay.url)
      )
      .map((relay) => {
        log(debug, "info", `⬆️ nostr (${relay.url}): Sending event:`, event);

        return relay.publish(event);
      });
  };

  const value: NostrContextType = {
    debug,
    isLoading,
    connectedRelays,
    publish,
    onConnect: (_onConnectCallback?: OnConnectFunc) => {
      if (_onConnectCallback) {
        onConnectCallback = _onConnectCallback;
      }
    },
    onDisconnect: (_onDisconnectCallback?: OnDisconnectFunc) => {
      if (_onDisconnectCallback) {
        onDisconnectCallback = _onDisconnectCallback;
      }
    },
  };

  return (
    <NostrContext.Provider value={value}>{children}</NostrContext.Provider>
  );
}
