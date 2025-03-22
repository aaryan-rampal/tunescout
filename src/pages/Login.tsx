// import { useState } from "react";
// import {
//   Box,
//   Button,
//   Container,
//   Input,
//   FormControl,
//   FormLabel,
//   Heading,
//   Text,
//   useToast
// } from "@chakra-ui/react";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const toast = useToast(); // Initialize toast

//   const handleLogin = async () => {
//     const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username, password }),
//       credentials: "include",
//     });

//     const data = await response.json();
//     if (data.success) {
//       navigate("/dashboard"); // Redirect after login
//       toast({
//         title: "Login Successful",
//         description: "You have successfully logged in!",
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });
//     } else {
//     //   alert(data.message);
//       toast({
//         title: "Login Failed",
//         description: data.message,
//         status: "error",
//         duration: 4000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <Box bg="gray.800" minHeight="100vh" p="20px" display="flex" justifyContent="center" alignItems="center">
//       <Container maxWidth="400px" bg="white" p="6" borderRadius="8px" boxShadow="lg">
//         <Heading fontSize="2xl" textAlign="center" mb="6">
//           Login to Your Account
//         </Heading>
//         <FormControl>
//           <FormLabel>Username</FormLabel>
//           <Input
//             type="username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="Enter your username"
//           />
//         </FormControl>
//         <FormControl mt="4">
//           <FormLabel>Password</FormLabel>
//           <Input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter your password"
//           />
//         </FormControl>
//         <Button colorScheme="green" width="100%" mt="6" onClick={handleLogin}>
//           Login
//         </Button>
//         <Text fontSize="sm" mt="4" textAlign="center">
//           Don't have an account? <a href="/tunescout/register" style={{ color: "blue" }}>Sign Up</a>
//         </Text>
//       </Container>
//     </Box>
//   );
// }

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
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth(); // Use Auth Context

  const handleLogin = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
          credentials: "include",
        },
      );

      const data = await response.json();
      if (data.success) {
        login({ username }); // Store user info in context
        toast({
          title: "Login Successful",
          description: "You have successfully logged in!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        navigate("/dashboard"); // Redirect after login
      } else {
        toast({
          title: "Login Failed",
          description: data.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to connect to the server.",
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
          Login to Your Account
        </Heading>
        <FormControl>
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
            placeholder="Enter your password"
          />
        </FormControl>
        <Button colorScheme="green" width="100%" mt="6" onClick={handleLogin}>
          Login
        </Button>
        <Text fontSize="sm" mt="4" textAlign="center">
          Don't have an account?{" "}
          <a href="/register" style={{ color: "blue" }}>
            Sign Up
          </a>
        </Text>
      </Container>
    </Box>
  );
}
