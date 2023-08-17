import { Box, Space, Stack, Text } from "@mantine/core";
import UserCard from "components/UserCard/UserCard";
import { SearchIcon } from "icons/StemstrIcon";

type SearchResultsProps = {
  query: string;
  profilePubkeyResults: string[];
};

export default function SearchResults({
  query,
  profilePubkeyResults,
}: SearchResultsProps) {
  if (!query)
    return (
      <>
        <Space h={60} />
        <Box mx="auto" pos="relative" c="white" w={40} h={40}>
          <SearchIcon width={40} height={40} />
          <Box
            pos="absolute"
            top={0}
            right={0}
            bottom={0}
            left={0}
            sx={{
              background: "linear-gradient(135deg, #F9F5FF 0%, #A17BF0 100%)",
              mixBlendMode: "darken",
            }}
          />
        </Box>
        <Text mt="md" ta="center" c="white" fz="md">
          Search for profiles and hashtags
        </Text>
      </>
    );

  return (
    <Stack>
      {profilePubkeyResults.map((pubkey) => (
        <UserCard key={pubkey} pubkey={pubkey} />
      ))}
    </Stack>
  );
}
