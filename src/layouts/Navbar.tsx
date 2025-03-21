import { Link } from "react-router-dom";
import { Box, Flex, Spacer, Button, Heading, Text } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext"; // Import Auth Context

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <Box bg="green.800" p="4">
      <Flex alignItems="center">
        <Heading color="white" fontSize="xl" ml="4">
          <Link to="/">TuneScout</Link>
        </Heading>
        <Spacer />
        <Flex gap="4" mr="4" alignItems="center">
          {user ? (
            <>
              {/* <Text color="white">Hey, {user.email.split("@")[0]}</Text> */}
              {/* <Text color="white">Hey, {user}</Text> */}
              console.log(user)
              <Button colorScheme="red" onClick={logout}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" colorScheme="teal" variant="outline">
                Sign In
              </Button>
              <Button as={Link} to="/register" colorScheme="green">
                Sign Up
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
