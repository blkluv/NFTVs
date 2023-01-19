import { useState, useEffect } from "react";
import { Player } from "@livepeer/react";
import { Petrona } from "@next/font/google";
import UAuth from "@uauth/js";

const petrona = Petrona({ weight: "500" });

const uauth = new UAuth({
  clientID: process.env.NEXT_PUBLIC_UNSTOPPABLEDOMAIN_CLIENT_ID,
  redirectUri: "https://bubblestreamr-unstopppable.vercel.app/",
  scope: "openid wallet ",
});

import HeroVideo from "../HeroVideo";
import {
  Box,
  Text,
  Center,
  TextInput,
  createStyles,
  Tooltip,
  Button,
  Image,
  Group,
  CopyButton,
  ActionIcon,
} from "@mantine/core";
import { IconCopy, IconCheck } from "@tabler/icons";
import { IconPlayerPlay } from "@tabler/icons";
import { Chat } from "@pushprotocol/uiweb";

import HeaderTitle from "../HeaderTitle";
const PushChatApiKey = process.env.NEXT_PUBLIC_PUSHCHAT_API_KEY;

const useStyles = createStyles((theme) => ({
  title: {
    fontWeight: 800,
    fontSize: 30,
    letterSpacing: -1,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    marginBottom: theme.spacing.xs,
    textAlign: "center",
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    "@media (max-width: 520px)": {
      fontSize: 28,
      textAlign: "left",
    },
  },

  highlight: {
    color: "#00eb88",
  },

  item: {
    "&[data-hovered]": {
      backgroundColor:
        theme.colors[theme.primaryColor][theme.fn.primaryShade()],
      color: theme.white,
    },
  },
}));

export default function JoinStream() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [user, setUser] = useState();
  const [authorization, setAuthorization] = useState();
  const [playbackId, setPlaybackId] = useState("");
  const [renderPlayer, setRenderPlayer] = useState(false);
  const setRenderPlayerChild = (value) => {
    setRenderPlayer(value);
  };

  // Unstoppable Domains login Logic
  // Check to see if the user is inside the cache
  useEffect(() => {
    setLoading(true);
    uauth
      .user()
      .then(setUser)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Login with a popup and save the user
  const handleLogin = () => {
    setLoading(true);
    uauth
      .loginWithPopup()
      .then(setAuthorization)
      .then(() => uauth.user().then(setUser))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  // Logout and delete user
  const handleLogout = () => {
    setLoading(true);
    uauth
      .logout()
      .then(() => setUser(undefined))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  if (loading) {
    return <>Loading...</>;
  }

  if (error) {
    console.error(error);
    return <>{String(error.stack)}</>;
  }

  const getEllipsisTxt = (str, n = 4) => {
    if (str) {
      return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
    }
    return "";
  };

  function Quote() {
    return (
      <Center>
        <Box
          hidden={
            renderPlayer && (
              <>
                <Box my={5}>
                  <Player
                    aspectRatio="16to9"
                    autoPlay
                    showTitle
                    title
                    controls
                    playbackId={playbackId}
                  />
                </Box>
              </>
            )
          }
        >
          <Text fz="xl" className={petrona.className}>
            Log in with Unstoppable Domain to enjoy the streaming.
          </Text>
        </Box>
      </Center>
    );
  }

  if (user && authorization) {
    return (
      <>
        <HeaderTitle />
        <Quote />
        <Center>
          <Box
            hidden={
              renderPlayer && (
                <Box my={5}>
                  <Player
                    aspectRatio="16to9"
                    autoPlay
                    showTitle
                    title
                    controls
                    playbackId={playbackId}
                  />
                </Box>
              )
            }
          >
            <Box mt={30}>
              <Text fz="lg" fw={700} className={petrona.className}>
                Playback ID:
              </Text>
              <div className="my-4">
                <TextInput
                  my={10}
                  size="md"
                  type="text"
                  name="playbackId here"
                  id="playbackId"
                  className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="playbackId here"
                  onChange={(event) => setPlaybackId(event.target.value)}
                  autoComplete="off"
                />
              </div>
            </Box>

            <Tooltip
              multiline
              withArrow
              width={300}
              transition="fade"
              label="ℹ The Playback ID that you obtained from the stream creator or Push Alert should be copied and pasted. After that, click the subscribe button to purchase a NFT via the Unlock Protocol and join the stream."
            >
              <Button
                fw={700}
                fz="xl"
                color="black"
                className={petrona.className}
                rightIcon={
                  <IconPlayerPlay size={20} color="black" stroke={5} />
                }
                styles={(theme) => ({
                  root: {
                    backgroundColor: "#ff63ca",
                    borderRadius: 10,
                    height: 42,
                    paddingLeft: 20,
                    paddingRight: 20,

                    "&:hover": {
                      backgroundColor: theme.fn.darken("#ff63ca", 0.05),
                    },
                  },
                  leftIcon: {
                    marginRight: 15,
                  },
                })}
                onClick={() => {
                  setRenderPlayerChild(true);
                }}
              >
                <Text
                  fw={700}
                  fz="xl"
                  color="black"
                  className={petrona.className}
                >
                  Watch Stream
                </Text>
              </Button>
            </Tooltip>
            {/* <JoinStreamButton renderPlayer={setRenderPlayerChild} /> */}
          </Box>
        </Center>

        <Center>
          <div mt={50}>
            {renderPlayer && (
              <>
                <Box my={20}>
                  <Player
                    aspectRatio="16to9"
                    autoPlay
                    showTitle
                    title
                    controls
                    playbackId={playbackId}
                  />
                </Box>

                <Group>
                  <Box>
                    <Tooltip
                      transition="fade"
                      transitionDuration={300}
                      label="Logout"
                      withArrow
                    >
                      <Button
                        fw={500}
                        onClick={handleLogout}
                        shadow="xl"
                        styles={(theme) => ({
                          root: {
                            backgroundColor: "#0D67FE",
                            borderRadius: 10,
                            height: 40,
                            paddingLeft: 20,
                            paddingRight: 20,

                            "&:hover": {
                              backgroundColor: theme.fn.darken("#0546B7", 0.05),
                            },
                          },
                          leftIcon: {
                            marginRight: 15,
                          },
                        })}
                      >
                        <Image alt="ud-logo" src="ud-logo.svg" px={1} />
                        <Text fw={500} className={petrona.className}>
                          {user.sub}
                        </Text>
                      </Button>
                    </Tooltip>

                    <Group my={10}>
                      <Button variant="default" radius="md">
                        <Group>
                          <Text>{getEllipsisTxt(user.wallet_address)}</Text>
                          <CopyButton
                            value={user.wallet_address}
                            timeout={2000}
                          >
                            {({ copied, copy }) => (
                              <Tooltip
                                label={copied ? "Copied" : "Copy"}
                                withArrow
                                position="right"
                              >
                                <ActionIcon
                                  color={copied ? "teal" : "gray"}
                                  onClick={copy}
                                >
                                  {copied ? (
                                    <IconCheck size={16} />
                                  ) : (
                                    <IconCopy size={16} />
                                  )}
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </CopyButton>
                        </Group>
                      </Button>

                      <Text fw={500} className={petrona.className}>
                        {user.name}
                      </Text>
                    </Group>
                  </Box>

                  <Box>
                    <Chat
                      primaryColor="#00eb88"
                      modalTitle="BubbleStreamr"
                      account={user.wallet_address} //user address
                      supportAddress="0xF76371C3f5B4b06BC62e3Fb1101E1fa3073Fbb54" //support address
                      apiKey={PushChatApiKey}
                      env="staging"
                    />
                  </Box>
                </Group>
              </>
            )}
          </div>
        </Center>
      </>
    );
  }

  return (
    <>
      <HeaderTitle />
      <Quote />
      <Center mt={5}>
        <Button
          styles={(theme) => ({
            root: {
              backgroundColor: "#0D67FE",
              "&:hover": {
                backgroundColor: theme.fn.darken("#0546B7", 0.05),
              },
            },
          })}
          ml={2}
          radius="md"
          fontSize={{ base: "ms", md: "md" }}
          cursor="pointer"
          borderRadius="lg"
          minW="220"
          minH="12"
          onClick={handleLogin}
          shadow="xl"
        >
          <Image alt="ud-logo" src="/ud-logo.svg" px={1} />
          Login With Unstoppable
        </Button>
      </Center>
      <Center
        hidden={
          renderPlayer && (
            <>
              <Box my={5}>
                <Player
                  aspectRatio="16to9"
                  autoPlay
                  showTitle
                  title
                  controls
                  playbackId={playbackId}
                />
              </Box>
            </>
          )
        }
      >
        <HeroVideo />
      </Center>
    </>
  );
}
