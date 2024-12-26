import React, { useState, useEffect, useRef } from "react";

const Dashboard: React.FC = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);
  const sentRequest = useRef(false); // Track if request has been sent
  const [isLoading, setIsLoading] = useState(true); // Track loading state

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
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px",
      margin: "10px",
      cursor: "pointer",
      backgroundColor: "#f9f9f9",
      border: "1px solid #ddd",
      borderRadius: "10px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      width: "150px",
    }}
  >
    <img
      src={playlist.image}
      alt={playlist.name}
      style={{
        width: "120px",
        height: "120px",
        borderRadius: "8px",
        objectFit: "cover",
        marginBottom: "8px",
      }}
    />
    <span
      style={{
        fontSize: "14px",
        color: "#333",
        textAlign: "center",
      }}
    >
      {playlist.name}
    </span>
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
