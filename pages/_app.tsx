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
import { NostrNotificationsProvider } from "ndk/NostrNotificationsProvider";
import { SubscribeWizardProvider } from "components/SubscribeWizard/SubscribeWizardProvider";
import { Analytics } from "@vercel/analytics/react";

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
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta
          name="description"
          content="A social experience for music artists to connect, collaborate and share amazing music - powered by nostr."
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
        <meta name="twitter:domain" content="stemstr.app" />
        <meta name="twitter:url" content="https://stemstr.app" />
        <meta name="twitter:title" content="Stemstr" />
        <meta
          name="twitter:description"
          content="A social experience for music producers to connect, collaborate and share amazing music - powered by nostr."
        />
        <meta
          name="twitter:image"
          content="https://i.nostrimg.com/c7b9edc7c3e81206afbd6a97825da99021699ac1de510651fb53362df488955c/file.png"
        />

        <link rel="shortcut icon" href="/favicon.svg" />
        <link
          rel="preload"
          href="/fonts/OnestRegular1602-hint.woff"
          as="font"
          crossOrigin=""
          type="font/woff"
        />

        <link rel="manifest" href="/manifest.json" />

        {/* iOS PWA icon */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Stemstr" />
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
            <NostrNotificationsProvider>
              <NotificationsProvider>
                <SubscribeWizardProvider>
                  <ApplicationContainer>
                    <Component {...pageProps} />
                    <Analytics />
                  </ApplicationContainer>
                </SubscribeWizardProvider>
              </NotificationsProvider>
            </NostrNotificationsProvider>
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
