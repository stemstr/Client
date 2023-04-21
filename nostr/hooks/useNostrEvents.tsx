import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  debounceTime = 1000,
}: {
  filter: Filter;
  enabled?: boolean;
  relayUrls?: string[];
  debounceTime?: number;
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

  const eventBatch = useRef<NostrEvent[]>([]);

  const processEventBatch = useCallback(() => {
    if (eventBatch.current.length) {
      setEvents((_events) => {
        const newEvents = uniqBy([...eventBatch.current, ..._events], "id");
        eventBatch.current = [];
        return newEvents;
      });
    }
  }, []);

  useEffect(() => {
    const debounceId = setInterval(processEventBatch, debounceTime);
    return () => clearInterval(debounceId);
  }, [debounceTime, processEventBatch]);

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
      eventBatch.current.push(event);
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
  const sortedEvents = useMemo(
    () => uniqEvents.sort((a, b) => b.created_at - a.created_at),
    [uniqEvents.length]
  );

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
