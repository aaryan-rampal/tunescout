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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await response.json();
    if (data.success) {
      navigate("/login"); // Redirect after successful registration
    } else {
      alert(data.message);
    }
  };

  return (
    <Box bg="gray.800" minHeight="100vh" p="20px" display="flex" justifyContent="center" alignItems="center">
      <Container maxWidth="400px" bg="white" p="6" borderRadius="8px" boxShadow="lg">
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
          <FormLabel>Password</FormLabel>
          <Input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter a secure password"
          />
        </FormControl>
        <Button colorScheme="green" width="100%" mt="6" onClick={handleRegister}>
          Sign Up
        </Button>
        <Text fontSize="sm" mt="4" textAlign="center">
          Already have an account? <a href="/tunescout/login" style={{ color: "blue" }}>Login</a>
        </Text>
      </Container>
    </Box>
  );
}
