import { useHomeFeed } from "ndk/hooks/useHomeFeed";
import { Feed } from "../Feed";
import useHomeFeedPubkeys from "../../ndk/hooks/useHomeFeedPubkeys";
import usePreloadProfileCache from "../../ndk/hooks/usePreloadProfileCache";

const HomeFeedContent = ({ pubkeys }: { pubkeys: string[] }) => {
  const events = useHomeFeed(pubkeys);

  // only preload the first 20 profiles to reduce amount of data fetched and since relays don't return any
  // results when requesting too many profiles
  const hasAttemptedProfileCachePreload = usePreloadProfileCache(
    events.slice(0, 20).map(({ pubkey }) => pubkey)
  );

  return hasAttemptedProfileCachePreload ? <Feed events={events} /> : null;
};

export default function HomeFeed() {
  const pubkeys = useHomeFeedPubkeys();

  return pubkeys.length > 0 ? <HomeFeedContent pubkeys={pubkeys} /> : null;
}
