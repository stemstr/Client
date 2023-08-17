import { Anchor, Box, Center, Group, Space, Stack, Text } from "@mantine/core";
import UserCard from "components/UserCard/UserCard";
import { Route } from "enums";
import { HashtagIcon, SearchIcon } from "icons/StemstrIcon";
import Link from "next/link";

type SearchResultsProps = {
  onClose: () => void;
  query: string;
  profilePubkeyResults: string[];
};

export default function SearchResults({
  onClose,
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
    <Stack onClick={onClose}>
      <HashtagResult key="HashtagResult" query={query} />
      {profilePubkeyResults.map((pubkey) => (
        <UserCard key={pubkey} pubkey={pubkey} showFollowButton={false} />
      ))}
    </Stack>
  );
}

const HashtagResult = ({ query }: { query: string }) => {
  return (
    <Anchor
      component={Link}
      href={{
        pathname: Route.Tag,
        query: { tag: query },
      }}
      c="white"
      p="md"
      sx={(theme) => ({
        border: "1px solid",
        borderColor: theme.colors.gray[4],
        borderRadius: 12,
        transition: "border-color .3s ease",
        "&:hover": {
          borderColor: theme.colors.purple[5],
        },
      })}
    >
      <Group>
        <Center
          w={42}
          h={42}
          sx={{
            borderRadius: 21,
            background:
              "linear-gradient(135deg, rgba(249, 245, 255, 0.40) 0%, rgba(161, 123, 240, 0.40) 100%)",
          }}
        >
          <HashtagIcon width={24} height={24} />
        </Center>
        <Text fz="lg" fw={500}>
          {query}
        </Text>
      </Group>
    </Anchor>
  );
};
