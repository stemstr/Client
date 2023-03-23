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
import stemstrTheme from "../theme/Theme";
import { CustomFonts } from "../theme/CustomFonts";
import { ApplicationContainer } from "../components/ApplicationContainer/ApplicationContainer";
import NostrProvider from "../nostr/NostrProvider";
import { reduxWrapper } from "../store/Store";
import NostrStateProvider from "../store/NostrStateProvider";

const relayUrls: string[] = [
  // paid relays
  "wss://eden.nostr.land",
  "wss://puravida.nostr.land",
  "wss://nostr.milou.lol",
  "wss://nostr.wine",
  // public relays
  // "wss://relay.damus.io",
  // "wss://relay.snort.social",
  "wss://nos.lol",
  // "wss://relay.current.fyi",
];
if (process.env.NEXT_PUBLIC_STEMSTR_RELAY)
  relayUrls.push(process.env.NEXT_PUBLIC_STEMSTR_RELAY);

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
        <title>stemstr</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
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
          <NostrProvider relayUrls={relayUrls} debug={false}>
            <NostrStateProvider>
              <NotificationsProvider>
                <ApplicationContainer>
                  <Component {...pageProps} />
                </ApplicationContainer>
              </NotificationsProvider>
            </NostrStateProvider>
          </NostrProvider>
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
