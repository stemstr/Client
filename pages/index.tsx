import { Welcome } from '../components/Welcome/Welcome';
import GlobalFeed from '../components/GlobalFeed/GlobalFeed';
import GlobalFeedHeader from '../components/GlobalFeedHeader/GlobalFeedHeader';
import GlobalFeedChips from '../components/GlobalFeedChips/GlobalFeedChips';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';

export default function HomePage() {
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
