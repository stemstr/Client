import GlobalFeed from "../components/GlobalFeed/GlobalFeed";
import GlobalFeedHeader from "../components/GlobalFeedHeader/GlobalFeedHeader";

export default function HomePage() {
  return (
    <>
      {/* <ColorSchemeToggle /> */}
      <GlobalFeedHeader />
      <GlobalFeed />
    </>
  );
}
