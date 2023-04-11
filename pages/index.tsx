import Head from 'next/head'
import HomeFeed from "../components/HomeFeed/HomeFeed";
import HomeFeedHeader from "../components/HomeFeedHeader/HomeFeedHeader";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Stemstr - Discover</title>
      </Head>
      {/* <ColorSchemeToggle /> */}
      <HomeFeedHeader />
      <HomeFeed />
    </>
  );
}
