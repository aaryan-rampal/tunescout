import { Link } from "react-router-dom";
import { Box, Flex, Spacer, Button, Heading } from "@chakra-ui/react";

export default function Navbar() {
  return (
    <Box bg="green.800" p="4">
      <Flex alignItems="center">
        <Heading color="white" fontSize="xl" ml="4">
          <Link to="/">TuneScout</Link>
        </Heading>
        <Spacer />
        <Flex gap="4" mr="4">
          <Button as={Link} to="/login" colorScheme="teal" variant="outline">
            Sign In
          </Button>
          <Button as={Link} to="/register" colorScheme="green">
            Sign Up
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
