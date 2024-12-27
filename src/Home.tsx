import React from "react";
import { styled } from "@mui/system";
import { Box, Typography, Button } from "@mui/material";
import SpotifyLogo from "./spotify-logo.png";

interface HomeProps {
  handleLogin: () => void;
}

// Styled Components
const StyledContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100vw",
  backgroundColor: "#1DB954", // Spotify green
  margin: 0,
  padding: 0,
  overflow: "hidden",
});

const StyledHeading = styled(Typography)({
  color: "black",
  textAlign: "center",
  marginBottom: "1rem",
});

const StyledButton = styled(Button)({
  backgroundColor: "white",
  color: "black",
  borderRadius: "20px",
  padding: "10px 20px",
  fontSize: "16px",
  textTransform: "none", // Disable uppercase text
  "&:hover": {
    backgroundColor: "#f0f0f0", // Slightly darker on hover
  },
});

const Home: React.FC<HomeProps> = ({ handleLogin }) => (
  <StyledContainer>
    <StyledHeading variant="h3" component="h1">
      Ready to find your next favorite song?
    </StyledHeading>
    <StyledButton
      variant="contained"
      onClick={handleLogin}
      startIcon={
        <img src={SpotifyLogo} alt="Spotify Logo" style={{ height: "20px" }} />
      }
    >
      Log in with Spotify
    </StyledButton>
  </StyledContainer>
);

export default Home;
