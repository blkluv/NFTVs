import React, { useState, useMemo } from "react";
import { AppProps } from "next/app";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";

export default function App(props: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  const { Component, pageProps } = props;

  const livepeerClient = useMemo(() => {
    return createReactClient({
      provider: studioProvider({
        apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY,
      }),
    });
  }, []);

  return (
    <>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme,
            colors: {
              bgColor: ["#0A1A2F"],
            },
          }}
        >
          <NotificationsProvider>
            <LivepeerConfig
              dehydratedState={pageProps?.dehydratedState}
              client={livepeerClient}
            >
              <Component {...pageProps} />
            </LivepeerConfig>
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
