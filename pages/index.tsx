import { Welcome } from "../components/Welcome/Welcome";
import GlobalFeed from "../components/GlobalFeed/GlobalFeed";
import GlobalFeedHeader from "../components/GlobalFeedHeader/GlobalFeedHeader";
import GlobalFeedChips from "../components/GlobalFeedChips/GlobalFeedChips";
import { ColorSchemeToggle } from "../components/ColorSchemeToggle/ColorSchemeToggle";
import { useNostrEvents, dateToUnix } from "nostr-react";
import { useEffect } from "react";

export default function HomePage() {
  // const { events } = useNostrEvents({
  //   filter: {
  //     kinds: [3],
  //     authors: [
  //       "3335d373e6c1b5bc669b4b1220c08728ea8ce622e5a7cfeeb4c0001d91ded1de",
  //       // "npub1xv6axulxcx6mce5mfvfzpsy89r4gee3zuknulm45cqqpmyw7680q5pxea6",
  //     ],
  //   },
  // });

  // useEffect(() => {
  //   // if (events[0]?.kind && ![0, 1, 3, 4, 6, 7, 1984].includes(events[0].kind))
  //   if (events[0]?.content) console.log(JSON.parse(events[0].content));
  //   // if (events[0]) console.log(events[0]);
  // }, [events]);

  return (
    <>
      {/* <ColorSchemeToggle /> */}
      {/* <Welcome /> */}
      <GlobalFeedHeader />
      <GlobalFeedChips />
      <GlobalFeed />
    </>
  );
}
