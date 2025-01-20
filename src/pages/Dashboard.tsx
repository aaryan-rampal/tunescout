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
  Text,
  VStack,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import PlaylistList from "./PlayList";

const Dashboard: React.FC = () => {
  const [view, setView] = useState<"all" | "generated" | "done">("all");
  const [selectedPlaylist, setSelectedPlaylist] = useState<any | null>(null);
  const [numberOfRefreshes, setNumberOfRefreshes] = useState(0);
  const [numSongs, setNumSongs] = useState(10);
  const [spotifyPlaylistUrl, setSpotifyPlaylistUrl] = useState<string | null>(
    null
  );

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
      generatePlaylist(
        selectedPlaylist!.id,
        accessToken!,
        numberOfRefreshes,
        numSongs
      ),
    onSuccess: () => {
      setNumberOfRefreshes(numberOfRefreshes + 1);
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
    onSuccess: (data) => {
      // console.log(data);
      const spotifyEmbedUrl = `https://open.spotify.com/embed/playlist/${data.playlistId}`; // ✅ Convert ID to URL
      setSpotifyPlaylistUrl(spotifyEmbedUrl);
      console.log(spotifyEmbedUrl);
      setView("done");
    },
  });

  if (playlistsLoading) return <div>Loading playlists...</div>;

  return (
    <Box p={8} h="100vh">
      <VStack spacing={6} align="stretch">
        <Heading as="h2" size="lg">
          {view === "all"
            ? "Select a Playlist"
            : view === "generated"
            ? "Generated Playlist"
            : ""}
        </Heading>

        {/* ✅ "All Playlists" View */}
        {view === "all" && (
          <>
            <PlaylistList
              playlists={playlists || []}
              setSelectedPlaylist={setSelectedPlaylist}
            />
            <Box>
              <Text mb={2}>Number of Songs: {numSongs}</Text>
              <Slider
                defaultValue={10}
                min={5}
                max={50}
                step={1}
                onChange={(value) => setNumSongs(value)} // ✅ Update state
              >
                <SliderTrack bg="gray.200">
                  <SliderFilledTrack bg="blue.500" />
                </SliderTrack>
                <SliderThumb boxSize={6} />
              </Slider>
            </Box>
            <Button
              onClick={() => generate()}
              isLoading={generating}
              colorScheme="blue"
            >
              Generate Recommendations
            </Button>
          </>
        )}

        {/* ✅ "Generated Recommendations" View */}
        {view === "generated" && (
          <>
            <PlaylistList
              playlists={recommendedTracks || []}
              setSelectedPlaylist={() => {}}
            />
            <HStack>
              <Button onClick={() => setView("all")} colorScheme="gray">
                Back
              </Button>
              {/* TODO: if you click generate too much server throws error */}
              <Button
                onClick={() => generate()}
                isLoading={generating}
                colorScheme="blue"
              >
                Regenerate Recommendations
              </Button>
              <Button
                onClick={() => create()}
                isLoading={creating}
                colorScheme="green"
              >
                Create Playlist
              </Button>
            </HStack>
          </>
        )}

        {/* ✅ "Done" View with Embedded Spotify Playlist */}
        {view === "done" && spotifyPlaylistUrl && (
          <>
            <Text fontSize="xl" fontWeight="bold" textAlign="center">
              🎉 All done, go check it out! 🎵
            </Text>
            <Box display="flex" justifyContent="center" h="85vh">
              <iframe
                src={spotifyPlaylistUrl}
                width="100%"
                // height="700"
                allow="encrypted-media"
                title={`Spotify Playlist ${spotifyPlaylistUrl}`}
              />
            </Box>
            <Button onClick={() => setView("all")} colorScheme="blue">
              Back to Playlists
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default Dashboard;
