import React, { useState, useEffect, useRef } from "react";
import SpotifyLogo from "../spotify-logo.png";
import {
  Box,
  Typography,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/system";

// TODO: convert all network requests to react-query
const Container = styled(Box)({
  padding: "16px",
});

const ScrollableBox = styled(Box)({
  maxHeight: "400px",
  overflowY: "scroll",
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "16px",
});

const StyledCard = styled(Card)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "16px",
  cursor: "pointer",
  width: "150px",
  marginLeft: "auto",
  marginRight: "auto",
  boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.1)",
});

const StyledCardMedia = styled(CardMedia)({
  borderRadius: "8px",
  objectFit: "cover",
});

const ButtonGroup = styled(Box)({
  marginTop: "16px",
  display: "flex",
  gap: "16px",
});

const StyledListItem = styled(ListItem)({
  marginBottom: "8px",
});

const StyledAvatar = styled(Avatar)({
  width: "56px",
  height: "56px",
});

const SpotifyLink = styled("a")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  marginLeft: "16px",
  backgroundColor: "#1db954", // Spotify green
  borderRadius: "50%", // Circular background
  cursor: "pointer",
  textDecoration: "none",
  "&:hover": {
    backgroundColor: "#1aa34a", // Darker green on hover
  },
});

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const sentRequest = useRef(false); // Track if request has been sent

  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);

  const [recommendedTracks, setRecommendedTracks] = useState<any[]>([]); // Tracks from the backend
  const [view, setView] = useState<"selection" | "recommendations">(
    "selection"
  ); // Toggle between views

  const [numberOfRefreshes, setNumberOfRefreshes] = useState(0);

  const fetchPlaylists = async () => {
    if (sentRequest.current) return;

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      console.error("No access token found");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3001/spotify/get_playlists",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ access_token: accessToken }),
        }
      );
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
    setNumberOfRefreshes(0); // Reset refresh count
    if (selectedPlaylist) {
      // console.log("Selected Playlist:", selectedPlaylist);
      try {
        const response = await fetch(
          "http://localhost:3001/spotify/generate_playlist",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              playlist_id: selectedPlaylist.id,
              access_token: accessToken,
              number_of_refreshes: numberOfRefreshes,
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
    setNumberOfRefreshes((prev) => prev + 1);
    setIsLoading(true);
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      console.error("No access token found");
      return;
    }
    if (selectedPlaylist) {
      // console.log("Selected Playlist:", selectedPlaylist);
      try {
        const response = await fetch(
          "http://localhost:3001/spotify/generate_playlist",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              playlist_id: selectedPlaylist.id,
              access_token: accessToken,
              number_of_refreshes: numberOfRefreshes,
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

  const handleCreate = async () => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      console.error("No access token found");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:3001/spotify/create_playlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: access_token,
            tracks: recommendedTracks,
            name: `${selectedPlaylist.name} vibes`,
          }),
        }
      );

      const data = await response.json();
      console.log("Playlist created:", data);
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
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
    <Container>
      {view === "selection" && (
        <>
          <Typography variant="h4" gutterBottom>
            Select a Playlist
          </Typography>
          <ScrollableBox>
            {playlists.map((playlist) => (
              <StyledCard key={playlist.id}>
                <CardActionArea
                  onClick={() => handlePlaylistSelection(playlist)}
                >
                  <StyledCardMedia
                    component="img"
                    height="120"
                    image={playlist.image}
                    alt={playlist.name}
                  />
                  <CardContent>
                    <Typography variant="body1" textAlign="center">
                      {playlist.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </StyledCard>
            ))}
          </ScrollableBox>
          <ButtonGroup>
            <Button variant="contained" color="primary" onClick={handleProceed}>
              Generate similar tracks
            </Button>
          </ButtonGroup>
        </>
      )}

      {view === "recommendations" && (
        <>
          <Typography variant="h4" gutterBottom>
            Recommended Playlist
          </Typography>
          {/* <ScrollableBox>
            {recommendedTracks.map((track) => (
              <StyledListItem key={track.id}>
                <ListItemAvatar>
                  <StyledAvatar src={track.image} alt={track.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={track.name}
                  secondary={`${track.artist} • ${formatDuration(
                    track.runtime
                  )}`}
                />
              </StyledListItem>
            ))}
          </ScrollableBox>
          <ScrollableBox> */}
          {recommendedTracks.map((track) => (
            <StyledListItem key={track.id}>
              <ListItemAvatar>
                <StyledAvatar src={track.image} alt={track.name} />
              </ListItemAvatar>
              <ListItemText
                primary={track.name}
                secondary={`${track.artist} • ${formatDuration(track.runtime)}`}
              />
              <SpotifyLink
                href={track.uri}
                target="_blank"
                rel="noopener noreferrer"
              ></SpotifyLink>
            </StyledListItem>
          ))}
          {/* </ScrollableBox> */}
          <ButtonGroup>
            <Button variant="contained" color="primary" onClick={handleRefresh}>
              Refresh Suggestions
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" color="primary" onClick={handleCreate}>
              Create Playlist
            </Button>
          </ButtonGroup>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
