import { useState } from "react";
import NextApp, { AppProps, AppContext } from "next/app";
import { getCookie, setCookie } from "cookies-next";
import Head from "next/head";
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import stemstrTheme from "theme/Theme";
import { CustomFonts } from "theme/CustomFonts";
import { ApplicationContainer } from "components/ApplicationContainer/ApplicationContainer";
import { NDKProvider } from "ndk/NDKProvider";
import { reduxWrapper } from "store/Store";
import { DEFAULT_RELAY_URLS } from "../constants";

if (process.env.NEXT_PUBLIC_STEMSTR_RELAY)
  DEFAULT_RELAY_URLS.push(process.env.NEXT_PUBLIC_STEMSTR_RELAY);

function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <>
      <Head>
        <title>Stemstr</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content="A social experience for music producers to connect, collaborate and share amazing music - powered by nostr."
        />
        <meta
          name="keywords"
          content="music, collaboration, social, production, producers, nostr, decentralized, zaps, bitcoin"
        />

        <meta property="og:url" content="https://stemstr.app" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Stemstr" />
        <meta
          property="og:description"
          content="A social experience for music producers to connect, collaborate and share amazing music - powered by nostr."
        />
        <meta
          property="og:image"
          content="https://nostr.build/i/nostr.build_bfb0664574164159b287893e2f0b07c4585ff0a2b4725b4da7aa1683f7a8759d.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="stemstr.app" />
        <meta property="twitter:url" content="https://stemstr.app" />
        <meta name="twitter:title" content="Stemstr" />
        <meta
          name="twitter:description"
          content="A social experience for music producers to connect, collaborate and share amazing music - powered by nostr."
        />
        <meta
          name="twitter:image"
          content="https://nostr.build/i/nostr.build_bfb0664574164159b287893e2f0b07c4585ff0a2b4725b4da7aa1683f7a8759d.png"
        />

        <link rel="shortcut icon" href="/favicon.svg" />
        <link
          rel="preload"
          href="/fonts/OnestRegular1602-hint.woff"
          as="font"
          crossOrigin=""
          type="font/woff"
        />
      </Head>

      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{
            colorScheme,
            ...stemstrTheme,
          }}
          withGlobalStyles
          withNormalizeCSS
        >
          <CustomFonts />
          <NDKProvider explicitRelayUrls={DEFAULT_RELAY_URLS}>
            <NotificationsProvider>
              <ApplicationContainer>
                <Component {...pageProps} />
              </ApplicationContainer>
            </NotificationsProvider>
          </NDKProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie("mantine-color-scheme", appContext.ctx) || "dark",
  };
};

export default reduxWrapper.withRedux(App);
