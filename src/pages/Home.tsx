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
import { generateRandomString, sha256, base64encode } from "../utils";

export default function Home() {
  const handleLogin = async () => {
    const VITE_SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const REDIRECT_URI =
      import.meta.env.MODE === "development"
        ? "http://localhost:5173/tunescout/callback"
        : "https://aaryan-rampal.github.io/tunescout/callback";

    const SCOPES = [
      "playlist-read-private",
      "playlist-read-collaborative",
      "playlist-modify-private",
      "playlist-modify-public",
    ];

    const authUrl = new URL("https://accounts.spotify.com/authorize");
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    // generated in the previous step
    window.localStorage.setItem("code_verifier", codeVerifier);

    const params = {
      response_type: "code",
      client_id: VITE_SPOTIFY_CLIENT_ID,
      SCOPES,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: REDIRECT_URI,
    };

    authUrl.search = new URLSearchParams(params).toString();

    console.log("")
    console.log("This is the url " + authUrl.toString());

    window.location.href = authUrl.toString();
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
