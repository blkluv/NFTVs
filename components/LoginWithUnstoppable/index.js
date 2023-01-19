import { useState, useEffect } from "react";
import UAuth from "@uauth/js";
import { Button, Image, Text, Loader ,  Notification, Center} from "@mantine/core";
import React from "react";
import { IconX } from "@tabler/icons";

const uauth = new UAuth({
  clientID: process.env.NEXT_PUBLIC_UNSTOPPABLEDOMAIN_CLIENT_ID,
  redirectUri: "https://bubblestreamr-unstopppable.vercel.app/",
  scope: "openid wallet",
});

export default function LoginWithUnstoppable() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [user, setUser] = useState();
  const [authorization, setAuthorization] = useState();

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

  // console.log(Uauth.wallet_address);
  // console.log(Uauth.sub);

  if (user && authorization) {
    return (
      <>
        <Button
          ml={2}
          bg="#0D67FE"
          fontSize={{ base: "ms", md: "md" }}
          cursor="pointer"
          radius="md"
          minW="220"
          minH="12"
          onClick={handleLogout}
          shadow="xl"
        >
          {user.sub}
          {/* {getEllipsisTxt(user.wallet_address)}
          {user.name} */}
          <Image alt="ud-logo" src={user.picture} px={1} />
        </Button>

        <Text>
          {JSON.stringify(
            authorization.idToken.twitter.location,
            null,
            2
          ).replace(/['"]+/g, "")}
        </Text>
        <Text>
          {JSON.stringify(authorization.idToken.description, null, 2).replace(
            /['"]+/g,
            ""
          )}
        </Text>
      </>
    );
  }

  return (
    <Button
      ml={2}
      bg="#0D67FE"
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
      Login UNS Domain
    </Button>
  );
}
