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

export default function Home() {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/spotify/login`;
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
