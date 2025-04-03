import { VStack, SimpleGrid, Avatar, Text, Box } from "@chakra-ui/react";
import { useState } from "react";

interface Playlist {
  id: string;
  name: string;
  image: string;
}

interface PlaylistListProps {
  playlists: Playlist[];
  setSelectedPlaylist: (playlist: Playlist) => void;
}

const PlaylistList: React.FC<PlaylistListProps> = ({
  playlists,
  setSelectedPlaylist,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setSelectedId(playlist.id);
  };

  return (
    <Box
      maxH="65vh"
      overflowY="auto"
      border="1px solid #ccc"
      borderRadius="md"
      p={4}
    >
      <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing={4}>
        {playlists?.map((playlist) => (
          <Box
            p={3}
            borderRadius="md"
            borderWidth="1px"
            cursor="pointer"
            _hover={{ bg: "gray.100" }}
            // onClick={() => setSelectedPlaylist(playlist)}
            bg={selectedId === playlist.id ? "gray.100" : "white"} // Highlight selected item
            onClick={() => handleSelect(playlist)}
            w="100%"
            maxW="200%"
            mx="auto"
          >
            <VStack padding={2} spacing={2}>
              <Avatar
                src={playlist.image}
                name={playlist.name}
                boxSize={{ base: "100px", md: "140px", lg: "196px" }}
                borderRadius="8px"
              />
              <Text
                fontWeight="bold"
                fontSize={{ base: "sm", md: "md" }}
                textAlign="center"
                noOfLines={3}
              >
                {playlist.name}
              </Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PlaylistList;
