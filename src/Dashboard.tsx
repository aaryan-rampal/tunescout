import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material";

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const sentRequest = useRef(false); // Track if request has been sent

  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);

  const [recommendedTracks, setRecommendedTracks] = useState<any[]>([]); // Tracks from the backend
  const [view, setView] = useState<"selection" | "recommendations">(
    "selection"
  ); // Toggle between views

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
    setView("selection");
    fetchPlaylists();
  }, []);

  const handlePlaylistSelection = (playlist: any) => {
    setSelectedPlaylist(playlist); // Set the selected playlist
  };

  const handleProceed = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (selectedPlaylist) {
      // console.log("Selected Playlist:", selectedPlaylist);
      try {
        const response = await fetch(
          "http://localhost:3001/api/generate_playlist",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              playlist_id: selectedPlaylist.id,
              access_token: accessToken,
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
        setView("recommendations");
        setRecommendedTracks(data); // Save tracks from backend
        console.log(data);
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

  const handleRefresh = async () => {
    // Refresh recommendations for the current playlist
    setIsLoading(true);
    const accessToken = localStorage.getItem("access_token");
    if (selectedPlaylist) {
      // console.log("Selected Playlist:", selectedPlaylist);
      try {
        const response = await fetch(
          "http://localhost:3001/api/generate_playlist",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              playlist_id: selectedPlaylist.id,
              access_token: accessToken,
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
        setRecommendedTracks(data); // Save tracks from backend
        console.log(data);
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

  const handleBack = () => {
    setView("selection");
    setSelectedPlaylist(null); // Reset selection
    setRecommendedTracks([]); // Clear recommendations
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, "0")}`;
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show loading message
  }

  return (
    <Box sx={{ p: 2 }}>
      {view === "selection" && (
        <>
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
                <CardActionArea
                  onClick={() => handlePlaylistSelection(playlist)}
                >
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
                    >
                      {playlist.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleProceed}>
              Generate similar track
            </Button>
          </Box>
        </>
      )}

      {view === "recommendations" && (
        <>
          <Typography variant="h4" gutterBottom>
            Recommended Playlist
          </Typography>
          <List
            sx={{
              maxHeight: "400px",
              overflowY: "scroll",
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 2,
            }}
          >
            {recommendedTracks.map((track) => (
              <ListItem key={track.id} sx={{ mb: 1 }}>
                <ListItemAvatar>
                  <Avatar
                    src={track.image}
                    alt={track.name}
                    variant="square"
                    sx={{ width: 56, height: 56 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={track.name}
                  secondary={`${track.artists} • ${formatDuration(
                    track.runtime
                  )}`}
                />
              </ListItem>
            ))}
          </List>
          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleRefresh}>
              Refresh Suggestions
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleBack}>
              Back
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
