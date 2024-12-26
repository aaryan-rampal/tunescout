import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from "@mui/material";

const Dashboard: React.FC = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);
  const sentRequest = useRef(false); // Track if request has been sent
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [filteredSongs, setFilteredSongs] = useState<any[]>([]); // Store the filtered songs
  const [showResults, setShowResults] = useState(false); // Toggle between selection and results

  const fetchPlaylists = async () => {
    if (sentRequest.current) return;

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      console.error("No access token found");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/get_playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ access_token: accessToken }),
      });
      sentRequest.current = true;

      if (!response.ok) {
        const error = await response.json();
        console.error("Error fetching recently played tracks:", error.message);
        setIsLoading(false); // Stop loading on error
        return;
      }

      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handlePlaylistSelection = (playlist: any) => {
    setSelectedPlaylist(playlist); // Set the selected playlist
  };

  const handleProceed = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (selectedPlaylist) {
      console.log("Selected Playlist:", selectedPlaylist);
      try {
        const response = await fetch(
          "http://localhost:3001/api/generate_playlist",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              access_token: accessToken,
              playlist_id: selectedPlaylist.id,
            }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          console.error(
            "Error sending selected playlist to backend:",
            error.message
          );
          return;
        }

        const data = await response.json();
        setFilteredSongs(data);
        setShowResults(true); // Switch to results view
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // TODO: Show error message to user
      console.error("No playlist selected");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show loading message
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Select a Playlist
      </Typography>
      <Box
        sx={{
          maxHeight: "400px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          borderRadius: 2,
          p: 2,
        }}
      >
        {playlists.map((playlist) => (
          <Card
            key={playlist.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              cursor: "pointer",
              width: "150px",
              mx: "auto",
              boxShadow: 3,
            }}
          >
            <CardActionArea onClick={() => handlePlaylistSelection(playlist)}>
              <CardMedia
                component="img"
                height="120"
                image={playlist.image}
                alt={playlist.name}
                sx={{
                  borderRadius: 1,
                  objectFit: "cover",
                }}
              />
              <CardContent>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  textAlign="center"
                  fontFamily={"sans-serif"}
                >
                  <strong>{playlist.name}</strong>
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleProceed}
        sx={{ mt: 2 }}
      >
        Proceed
      </Button>
    </Box>
  );
};

export default Dashboard;
