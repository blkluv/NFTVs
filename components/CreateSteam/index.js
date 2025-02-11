import { Player, useCreateStream } from "@livepeer/react";
import { IconPlayerPlay } from "@tabler/icons";
import { useMemo, useState, useEffect } from "react";
import moment from "moment";
import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";
import UAuth from "@uauth/js";
import { Chat } from "@pushprotocol/uiweb";
import { IconX } from "@tabler/icons";

import {
  Flex,
  Box,
  Button,
  Text,
  Center,
  TextInput,
  createStyles,
  CopyButton,
  ActionIcon,
  Tooltip,
  Group,
  Container,
  Accordion,
  Image,
  Loader,
  Notification,
} from "@mantine/core";
import HeroVideo from "../HeroVideo";
import { IconCopy, IconCheck } from "@tabler/icons";
import { showNotification, updateNotification } from "@mantine/notifications";
import HeaderTitle from "../HeaderTitle";
import { Petrona } from "@next/font/google";

const petrona = Petrona({ weight: "variable" });

const uauth = new UAuth({
  clientID: process.env.NEXT_PUBLIC_UNSTOPPABLEDOMAIN_CLIENT_ID,
  redirectUri: "https://bubblestreamr-unstopppable.vercel.app/",
  scope: "openid wallet",
});

const useStyles = createStyles((theme) => ({
  item: {
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,

    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

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

const PK = process.env.NEXT_PUBLIC_APP_CHANNEL_PK; // channel private key
const Pkey = `0x${PK}`;
const signer = new ethers.Wallet(Pkey);

const PushChatApiKey = process.env.NEXT_PUBLIC_PUSHCHAT_API_KEY;

const useLocalStorage = (storageKey, fallbackState) => {
  const [value, setValue] = useState(fallbackState);
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    setValue(stored ? JSON.parse(stored) : fallbackState);
  }, [fallbackState, storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
};

export default function CreateStream() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [user, setUser] = useLocalStorage("user", "");
  const [authorization, setAuthorization] = useLocalStorage(
    "authorization",
    ""
  );
  const { classes } = useStyles();
  const [streamName, setStreamName] = useState("");
  const {
    mutate: createStream,
    data: stream,
    status,
  } = useCreateStream(streamName ? { name: streamName } : null);

  const isLoading = useMemo(() => status === "loading", [status]);

  // Push Notification function
  const sendNotification = async () => {
    try {
      // apiResponse?.status === 204, if sent successfully!
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 1, // broadcast
        identityType: 2, // direct payload
        notification: {
          title: `BubbleStreamr - Presents: ${stream?.name}`,
          body: ``,
        },
        payload: {
          title: `BubbleStreamr - Presents: ${stream?.name}`,
          body: `Playback id: ${stream?.playbackId}  @ ${moment(
            stream.createdAt
          ).format("MMMM Do YYYY, h:mm:ss a")}`,
          cta: "",
          img: "",
        },
        recipients: "eip155:5:0xF76371C3f5B4b06BC62e3Fb1101E1fa3073Fbb54", // recipient address
        channel: "eip155:5:0x67Ea839b012319B93319a2b13b08efB9bF18a6F3", // your channel address
        env: "staging",
      });

      // apiResponse?.status === 204, if sent successfully!
      console.log("API repsonse: ", apiResponse);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  // Login with a popup and save the user
  const handleLogin = async () => {
    setLoading(true);
    try {
      const authorization = await uauth.loginWithPopup();
      const user = await uauth.user();
      setAuthorization(authorization);
      setUser(user);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Logout and delete user
  const handleLogout = async () => {
    setLoading(true);
    try {
      await uauth.logout();
      setAuthorization("");
      setUser("");
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader color="grape" />;
  }

  if (error) {
    console.error(error);
    return (
      <Center
        style={{
          position: "fixed",
        }}
      >
        <Notification icon={<IconX size={18} />} color="red">
          Error! Failed to Connect
        </Notification>
      </Center>
    );
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
        <Box>
          <Text
            fz="xl"
            className={petrona.className}
            hidden={
              stream?.playbackId && (
                <Player
                  title={stream?.name}
                  playbackId={stream?.playbackId}
                  autoPlay
                  muted
                />
              )
            }
          >
            Create a Stream by logging in with Unstoppable Domain to engage with
            your audience.
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
          <Box my={15}>
            <Box my={5}>
              <TextInput
                size="md"
                type="text"
                placeholder=" My Stream Name"
                onChange={(e) => setStreamName(e.target.value)}
                hidden={
                  stream?.playbackId && (
                    <Player
                      title={stream?.name}
                      playbackId={stream?.playbackId}
                      autoPlay
                      muted
                    />
                  )
                }
              />
            </Box>

            <Flex>
              {!stream && (
                <Button
                  rightIcon={
                    <IconPlayerPlay size={20} color="black" stroke={5} />
                  }
                  styles={(theme) => ({
                    root: {
                      backgroundColor: "#ffc1cc",
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
                    createStream?.();
                  }}
                  disabled={isLoading || !createStream}
                  variant="primary"
                >
                  <Text
                    className={petrona.className}
                    fw={700}
                    fz="xl"
                    color="black"
                  >
                    Create Stream
                  </Text>
                </Button>
              )}
            </Flex>

            {stream?.playbackId && (
              <>
                <Text
                  styles={(theme) => ({
                    marginBottom: theme.spacing.sm * 1.5,
                  })}
                  fw={700}
                  ta="left"
                  className={petrona.className}
                  fz="xl"
                >
                  {stream.name}
                </Text>

                <Player
                  aspectRatio="16to9"
                  title={stream?.name}
                  playbackId={stream?.playbackId}
                  autoPlay
                  muted
                />
              </>
            )}

            {stream && (
              <>
                <Container>
                  <Group mt={10}>
                    <Tooltip
                      width={220}
                      multiline
                      transition="fade"
                      transitionDuration={300}
                      label="ℹ In-app notifications with details about your stream, including a PLAYBACK ID, will be sent to your views on the community channel when you click this button."
                      withArrow
                    >
                      <Button
                        fw={500}
                        className={petrona.className}
                        styles={(theme) => ({
                          root: {
                            backgroundColor: "#ff63ca",
                            borderRadius: 10,
                            height: 40,
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
                          sendNotification();
                          showNotification({
                            id: "load-data",
                            loading: true,
                            title: "Sending Push Notification to Channel",
                            message:
                              "Notification will be Send in 5 seconds, you cannot close this yet",
                            autoClose: false,
                            disallowClose: true,
                          });

                          setTimeout(() => {
                            updateNotification({
                              id: "load-data",
                              color: "teal",
                              title: "Notification was Sent",
                              message:
                                "Notification will close in 2 seconds, you can close this notification now",
                              icon: <IconCheck size={16} />,
                              autoClose: 4000,
                            });
                          }, 3000);
                        }}
                      >
                        <Text
                          className={petrona.className}
                          fw={500}
                          color="creamwhite"
                        >
                          Push Alerts
                        </Text>
                      </Button>
                    </Tooltip>

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
                            backgroundColor: "#0d67fe",
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

                    <Group>
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

                    <Box py={15}>
                      <Group mx={10}>
                        <Box mx={10}>
                          <Text ta="right" className={petrona.className}>
                            {moment(stream.createdAt).calendar()}
                          </Text>
                        </Box>
                      </Group>
                    </Box>

                    <Box>
                      <Chat
                        primaryColor="#00eb88"
                        modalTitle="BubbleStreamr"
                        // account={user.wallet_address} //user address
                        supportAddress="0xF76371C3f5B4b06BC62e3Fb1101E1fa3073Fbb54" //support address
                        apiKey={PushChatApiKey}
                        env="staging"
                      />
                    </Box>
                  </Group>

                  <Accordion my={5}>
                    <Accordion.Item
                      className={classes.item}
                      value="reset-password"
                    >
                      <Accordion.Control>
                        <Text
                          fw={500}
                          tt="uppercase"
                          color="red.5"
                          className={petrona.className}
                        >
                          Useful information for your
                        </Text>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Group>
                          <Text className={petrona.className} fw={500}>
                            Stream Key:
                          </Text>
                          <Text>{stream.streamKey}</Text>
                          <CopyButton value={stream.streamKey} timeout={2000}>
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
                        <Group>
                          <Text className={petrona.className} fw={500}>
                            Playback Id:
                          </Text>
                          <Text>{stream.playbackId}</Text>
                          <CopyButton value={stream.playbackId} timeout={2000}>
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
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                </Container>
              </>
            )}
          </Box>
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
          ml={2}
          styles={(theme) => ({
            root: {
              backgroundColor: "#0D67FE",
              "&:hover": {
                backgroundColor: theme.fn.darken("#0546B7", 0.05),
              },
            },
          })}
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
          stream?.playbackId && (
            <Player
              title={stream?.name}
              playbackId={stream?.playbackId}
              autoPlay
              muted
            />
          )
        }
      >
        <HeroVideo />
      </Center>
    </>
  );
}
