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

const Dashboard: React.FC = () => {
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
      generatePlaylist(selectedPlaylist!.id, accessToken!, numberOfRefreshes),
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
    <Box p={8}>
      {!selectedPlaylist ? (
        <VStack spacing={6} align="stretch">
          <Heading as="h2" size="lg">
            Select a Playlist
          </Heading>
          <List spacing={4}>
            {playlists?.map((playlist) => (
              <ListItem
                key={playlist.id}
                p={3}
                borderRadius="md"
                borderWidth="1px"
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                onClick={() => setSelectedPlaylist(playlist)}
              >
                <HStack>
                  <Avatar src={playlist.image} alt={playlist.name} />
                  <Text fontWeight="bold">{playlist.name}</Text>
                </HStack>
              </ListItem>
            ))}
          </List>
        </VStack>
      ) : (
        <VStack spacing={6} align="stretch">
          <Heading as="h2" size="lg">
            Generating Recommendations...
          </Heading>
          <HStack>
            <Button
              onClick={() => generate()}
              isLoading={generating}
              colorScheme="blue"
            >
              Generate Recommendations
            </Button>
            <Button
              onClick={() => setSelectedPlaylist(null)}
              colorScheme="gray"
            >
              Back
            </Button>
          </HStack>

          {recommendedTracks && (
            <VStack spacing={4} align="stretch">
              <List spacing={4}>
                {recommendedTracks.map((track) => (
                  <ListItem
                    key={track.id}
                    p={3}
                    borderRadius="md"
                    borderWidth="1px"
                    display="flex"
                    alignItems="center"
                  >
                    <Avatar src={track.image} alt={track.name} mr={3} />
                    <Box>
                      <Text fontWeight="bold">{track.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {track.artist}
                      </Text>
                    </Box>
                  </ListItem>
                ))}
              </List>
              <Button
                onClick={() => create()}
                isLoading={creating}
                colorScheme="green"
              >
                Create Playlist
              </Button>
            </VStack>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default Dashboard;
