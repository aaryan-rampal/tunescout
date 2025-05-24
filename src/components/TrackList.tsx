import { List, ListItem, HStack, Avatar, Text, Box } from "@chakra-ui/react";
import { useState } from "react";
import { Track } from "../api/generated";

interface TrackListProps {
  tracks: Track[];
}

const formatRuntime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const TrackList: React.FC<TrackListProps> = ({ tracks }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (track: Track) => {
    setSelectedId(track.id);
  };

  return (
    <Box
      maxH="65vh"
      overflowY="auto"
      border="1px solid #ccc"
      borderRadius="md"
      p={4}
    >
      <List spacing={4}>
        {tracks?.map((track) => (
          <ListItem
            key={track.id}
            p={3}
            borderRadius="md"
            borderWidth="1px"
            cursor="pointer"
            _hover={{ bg: "gray.100" }}
            bg={selectedId === track.id ? "gray.100" : "white"}
            onClick={() => handleSelect(track)}
          >
            <HStack justify="space-between" align="center">
              <HStack>
                <Avatar
                  src={track.image_url}
                  name={track.name}
                  boxSize="64px"
                  borderRadius="8px"
                />
                <Box>
                  <Text fontWeight="bold">{track.name}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {track.artists.join(", ")}
                  </Text>
                </Box>
              </HStack>
              <Text fontSize="sm" fontWeight="medium" color="gray.500">
                {formatRuntime(track.runtime)}
              </Text>
            </HStack>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TrackList;
