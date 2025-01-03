import {
  Heading,
  Button,
  Container,
  Box,
  Image,
  Flex,
  Text,
} from "@chakra-ui/react";
import spotifyLogo from "../assets/spotify-logo.png";
import { useEffect, useState } from "react";

export default function Home() {
  const [authUrl, setAuthUrl] = useState("");

  useEffect(() => {
    const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
    const SCOPES = [
      "playlist-read-private",
      "playlist-read-collaborative",
      "playlist-modify-private",
      "playlist-modify-public",
    ];

    const authEndpoint =
      `https://accounts.spotify.com/authorize?` +
      `client_id=${SPOTIFY_CLIENT_ID}` +
      `&response_type=token` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&scope=${encodeURIComponent(SCOPES.join(" "))}`;

    setAuthUrl(authEndpoint);
  }, []);

  const handleLogin = () => {
    if (authUrl) {
      console.log(authUrl);
      window.location.href = authUrl;
    }
  };

  return (
    <Box bg="green.800" minHeight="100vh" p="20px">
      <Container
        pt="15%"
        maxWidth="100%"
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
      >
        <Heading color="white" fontSize="3rem" textAlign="center">
          Ready to find your next favorite song?
        </Heading>
      </Container>
      <Container
        maxWidth="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p="200px"
      >
        <Button
          variant="solid"
          //   colorScheme="teal"
          size="lg"
          borderRadius="8px"
          boxShadow="lg"
          p="8px 20px"
          display="flex"
          alignItems="center"
          onClick={handleLogin}
        >
          {/* Flex Container Inside the Button */}
          <Flex alignItems="center" justifyContent="space-between" width="100%">
            <Image
              src={spotifyLogo}
              alt="Spotify Logo"
              boxSize="24px" /* Size of the logo */
              marginRight="12px" /* Space between logo and text */
            />
            <Text
              color="green.700"
              textAlign="center"
              flex="1"
              fontWeight="bold"
            >
              Login with Spotify
            </Text>
          </Flex>
        </Button>
      </Container>
    </Box>
  );
}
