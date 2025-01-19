import { List, ListItem, HStack, Avatar, Text, Box } from "@chakra-ui/react";
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
      maxH="75vh"
      overflowY="auto"
      border="1px solid #ccc"
      borderRadius="md"
      p={4}
    >
      <List spacing={4}>
        {playlists?.map((playlist) => (
          <ListItem
            key={playlist.id}
            p={3}
            borderRadius="md"
            borderWidth="1px"
            cursor="pointer"
            _hover={{ bg: "gray.100" }}
            // onClick={() => setSelectedPlaylist(playlist)}
            bg={selectedId === playlist.id ? "gray.100" : "white"} // Highlight selected item
            onClick={() => handleSelect(playlist)}
          >
            <HStack>
              <Avatar
                src={playlist.image}
                alt={playlist.name}
                boxSize="96px"
                borderRadius="8px"
              />
              <Text fontWeight="bold">{playlist.name}</Text>
            </HStack>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PlaylistList;
