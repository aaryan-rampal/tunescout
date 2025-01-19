import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getPlaylists,
  generatePlaylist,
  createPlaylist,
} from "../services/spotifyService";
import {
  Box,
  Heading,
  Button,
  List,
  ListItem,
  Avatar,
  Text,
  VStack,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import PlaylistList from "./PlayList";

const Dashboard: React.FC = () => {
  const [view, setView] = useState<"all" | "generated">("all");
  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);
  const [numberOfRefreshes, setNumberOfRefreshes] = useState(0);
  const accessToken = localStorage.getItem("access_token");

  const { data: playlists, isLoading: playlistsLoading } = useQuery({
    queryKey: ["playlists", accessToken],
    queryFn: () => getPlaylists(accessToken!),
    enabled: !!accessToken,
  });

  console.log(playlists);

  // Generate Recommendations
  const {
    data: recommendedTracks,
    mutate: generate,
    isPending: generating,
  } = useMutation({
    mutationFn: () =>
      // TODO this doesn't actually update number of refreshes
      generatePlaylist(selectedPlaylist!.id, accessToken!, numberOfRefreshes),
    onSuccess: () => {
      setView("generated");
    },
  });

  // Create Playlist
  const { mutate: create, isPending: creating } = useMutation({
    mutationFn: () =>
      createPlaylist(
        accessToken!,
        recommendedTracks!,
        `${selectedPlaylist?.name} vibes`
      ),
  });

  if (playlistsLoading) return <div>Loading playlists...</div>;

  return (
    <Box p={8} h="100vh">
      <VStack spacing={6} align="stretch">
        <Heading as="h2" size="lg">
          {view === "all" ? "Select a Playlist" : "Generated Playlist"}
        </Heading>

        {view === "all" ? (
          <>
            <PlaylistList
              playlists={playlists}
              setSelectedPlaylist={setSelectedPlaylist}
            />
            <Button
              onClick={() => generate()}
              isLoading={generating}
              colorScheme="blue"
            >
              Generate Recommendations
            </Button>
          </>
        ) : (
          <>
            <PlaylistList
              playlists={recommendedTracks}
              setSelectedPlaylist={setSelectedPlaylist}
            />
            <HStack>
              <Button onClick={() => setView("all")} colorScheme="gray">
                Back
              </Button>
              <Button
                colorScheme="green"
                onClick={() => create()}
                isLoading={creating}
              >
                Create Playlist
              </Button>
            </HStack>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default Dashboard;
