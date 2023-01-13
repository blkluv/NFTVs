"use client";

import { useState, useEffect } from "react";
import { IconPlayerPlay } from "@tabler/icons";
import { Button, Text, Tooltip, Center, Image } from "@mantine/core";
import { Petrona } from "@next/font/google";
import UAuth from "@uauth/js";

const petrona = Petrona({ weight: "500" });

const uauth = new UAuth({
  clientID: "8e80351e-d2ca-423f-8073-6816d95318ef",
  redirectUri: "http://localhost:3000",
  scope: "openid wallet email profile:optional social:optional",
});

export default function JoinStreamButton({ renderPlayer }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [user, setUser] = useState();
  const [authorization, setAuthorization] = useState();

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

  return (
    <div>
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
          rightIcon={<IconPlayerPlay size={20} color="black" stroke={5} />}
          styles={(theme) => ({
            root: {
              backgroundColor: "#00eb88",
              borderRadius: 10,
              height: 42,
              paddingLeft: 20,
              paddingRight: 20,

              "&:hover": {
                backgroundColor: theme.fn.darken("#00eb88", 0.05),
              },
            },
            leftIcon: {
              marginRight: 15,
            },
          })}
          onClick={() => {
            renderPlayer(true);
          }}
        >
          <Text fw={700} fz="xl" color="black" className={petrona.className}>
            Watch Stream
          </Text>
        </Button>
      </Tooltip>
    </div>
  );
}

// return (
//   <Center mt={5}>
//     <Button
//       ml={2}
//       bg="#0D67FE"
//       radius="md"
//       fontSize={{ base: "ms", md: "md" }}
//       cursor="pointer"
//       borderRadius="lg"
//       minW="220"
//       minH="12"
//       onClick={handleLogin}
//       shadow="xl"
//     >
//       <Image alt="ud-logo" src="/ud-logo.svg" px={1} />
//       Login With Unstoppable
//     </Button>
//   </Center>
// );
