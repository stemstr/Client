import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Relay,
  Event as NostrEvent,
  relayInit,
  getEventHash,
  Pub,
} from "nostr-tools";
import { uniqBy, log } from "./utils";
import { relaysSlice } from "../store/Relays";
import { useSelector } from "react-redux";
import { AppState } from "../store/Store";
import { AuthState } from "../store/Auth";
import { signEvent as signEv } from "nostr-tools";

declare global {
  interface Window {
    nostr?: any; // Replace `any` with the appropriate type of `nostr` if you know it.
  }
}

type OnConnectFunc = (relay: Relay) => void;
type OnDisconnectFunc = (relay: Relay) => void;

interface NostrContextType {
  isLoading: boolean;
  debug?: boolean;
  connectedRelays: Relay[];
  onConnect: (_onConnectCallback?: OnConnectFunc) => void;
  onDisconnect: (_onDisconnectCallback?: OnDisconnectFunc) => void;
  publish: (event: NostrEvent, relayUrls?: string[]) => void;
  signEvent: (event: NostrEvent) => void;
}

export const NostrContext = createContext<NostrContextType>({
  isLoading: true,
  connectedRelays: [],
  onConnect: () => null,
  onDisconnect: () => null,
  publish: () => null,
  signEvent: () => null,
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
  const auth = useSelector<AppState, AuthState>((state) => state.auth);

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

  const publish = (event: NostrEvent, relayUrls?: string[]): Pub[] => {
    return connectedRelays
      .filter(
        (relay) => relayUrls === undefined || relayUrls?.includes(relay.url)
      )
      .map((relay) => {
        log(debug, "info", `⬆️ nostr (${relay.url}): Sending event:`, event);

        return relay.publish(event);
      });
  };

  const signEvent = async (
    event: NostrEvent
  ): Promise<NostrEvent | undefined> => {
    if (auth.nip07) {
      if (window.nostr) {
        return await window.nostr
          .signEvent(event)
          .then((signedEvent: NostrEvent) => {
            return signedEvent;
          })
          .catch((err: Error) => {
            console.error(err);
          });
      }
    } else {
      if (auth.sk && auth.user.pk) {
        event.pubkey = auth.user.pk;
        event.id = getEventHash(event);
        event.sig = signEv(event, auth.sk);
        return event;
      }
    }
  };

  const value: NostrContextType = {
    debug,
    isLoading,
    connectedRelays,
    publish,
    signEvent,
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
