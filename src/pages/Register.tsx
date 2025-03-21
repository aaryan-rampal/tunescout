import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Input,
  FormControl,
  FormLabel,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toast = useToast(); // Initialize toast

  const handleRegister = async () => {
    console.log(JSON.stringify({ email, username, password }));
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
        credentials: "include",
      }
    );

    // Log raw response text
    const text = await response.text();
    console.log("Raw response:", text);

    const data = await response.json();
    if (data.success) {
      navigate("/dashboard"); // Redirect after successful registration
      toast({
        title: "Login Successful",
        description: "You have successfully registered!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Registration Failed",
        description: data.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      bg="gray.800"
      minHeight="100vh"
      p="20px"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Container
        maxWidth="400px"
        bg="white"
        p="6"
        borderRadius="8px"
        boxShadow="lg"
      >
        <Heading fontSize="2xl" textAlign="center" mb="6">
          Create an Account
        </Heading>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </FormControl>
        <FormControl mt="4">
          <FormLabel>Username</FormLabel>
          <Input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </FormControl>
        <FormControl mt="4">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a secure password"
          />
        </FormControl>
        <Button
          colorScheme="green"
          width="100%"
          mt="6"
          onClick={handleRegister}
        >
          Sign Up
        </Button>
        <Text fontSize="sm" mt="4" textAlign="center">
          Already have an account?{" "}
          <a href="/tunescout/login" style={{ color: "blue" }}>
            Login
          </a>
        </Text>
      </Container>
    </Box>
  );
}
