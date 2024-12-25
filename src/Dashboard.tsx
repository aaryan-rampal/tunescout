import React, { useState, useEffect } from "react";

const Dashboard: React.FC = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  const fetchPlaylists = async () => {
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
    <div>
      <h1>Select a Playlist</h1>
      <div
        style={{
          maxHeight: "400px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => handlePlaylistSelection(playlist)}
            style={{
              padding: "10px",
              margin: "5px 0",
              cursor: "pointer",
              backgroundColor:
                selectedPlaylist?.id === playlist.id ? "#f0f0f0" : "white",
              border: "1px solid #ddd",
            }}
          >
            <img
              src={playlist.image}
              alt={playlist.name}
              style={{ width: "50px", height: "50px", marginRight: "10px" }}
            />
            <span>{playlist.name}</span>
          </div>
        ))}
      </div>
      <button
        onClick={handleProceed}
        style={{ marginTop: "10px", padding: "10px 20px", cursor: "pointer" }}
      >
        Proceed
      </button>
    </div>
  );
};

export default Dashboard;
