import { useCallback, useEffect, useState } from "react";
import { Relay, Event as NostrEvent, Sub, Filter } from "nostr-tools";
import { uniqBy, log } from "../utils";
import useNostr from "./useNostr";

type OnEventFunc = (event: NostrEvent) => void;
type OnDoneFunc = () => void;
type OnSubscribeFunc = (sub: Sub, relay: Relay) => void;

export default function useNostrEvents({
  filter,
  enabled = true,
  relayUrls,
}: {
  filter: Filter;
  enabled?: boolean;
  relayUrls?: string[];
}) {
  const {
    isLoading: isLoadingProvider,
    onConnect,
    debug,
    connectedRelays,
  } = useNostr();

  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<NostrEvent[]>([]);
  const [unsubscribe, setUnsubscribe] = useState<() => void | void>(() => {
    return;
  });

  let onEventCallback: null | OnEventFunc = null;
  let onSubscribeCallback: null | OnSubscribeFunc = null;
  let onDoneCallback: null | OnDoneFunc = null;

  // Lets us detect changes in the nested filter object for the useEffect hook
  const filterBase64 =
    typeof window !== "undefined" ? window.btoa(JSON.stringify(filter)) : null;

  const _unsubscribe = (sub: Sub, relay: Relay) => {
    log(
      debug,
      "info",
      `🙉 nostr (${relay.url}): Unsubscribing from filter:`,
      filter
    );
    return sub.unsub();
  };

  const subscribe = useCallback((relay: Relay, filter: Filter) => {
    log(
      debug,
      "info",
      `👂 nostr (${relay.url}): Subscribing to filter:`,
      filter
    );
    const sub = relay.sub([filter]);

    setIsLoading(true);

    const unsubscribeFunc = () => {
      _unsubscribe(sub, relay);
    };

    setUnsubscribe(() => unsubscribeFunc);

    sub.on("event", (event: NostrEvent) => {
      log(debug, "info", `⬇️ nostr (${relay.url}): Received event:`, event);
      onEventCallback?.(event);
      setEvents((_events) => {
        return [event, ..._events];
      });
    });

    sub.on("eose", () => {
      setIsLoading(false);
      onDoneCallback?.();
    });

    return sub;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const relaySubs = connectedRelays
      .filter(
        (relay) => relayUrls === undefined || relayUrls?.includes(relay.url)
      )
      .map((relay) => {
        const sub = subscribe(relay, filter);

        onSubscribeCallback?.(sub, relay);

        return {
          sub,
          relay,
        };
      });

    return () => {
      relaySubs.forEach(({ sub, relay }) => {
        _unsubscribe(sub, relay);
      });
    };
  }, [connectedRelays, filterBase64, enabled]);

  const uniqEvents = events.length > 0 ? uniqBy(events, "id") : [];
  const sortedEvents = uniqEvents.sort((a, b) => b.created_at - a.created_at);

  return {
    isLoading: isLoading || isLoadingProvider,
    events: sortedEvents,
    onConnect,
    connectedRelays,
    unsubscribe,
    onSubscribe: (_onSubscribeCallback: OnSubscribeFunc) => {
      if (_onSubscribeCallback) {
        onSubscribeCallback = _onSubscribeCallback;
      }
    },
    onEvent: (_onEventCallback: OnEventFunc) => {
      if (_onEventCallback) {
        onEventCallback = _onEventCallback;
      }
    },
    onDone: (_onDoneCallback: OnDoneFunc) => {
      if (_onDoneCallback) {
        onDoneCallback = _onDoneCallback;
      }
    },
  };
}
