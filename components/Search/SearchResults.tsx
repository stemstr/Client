import {
  Box,
  Button,
  DefaultProps,
  Group,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import { SearchIcon } from "icons/StemstrIcon";
import SearchResult from "./SearchResult";
import {
  reset as clearSearchHistory,
  selectSearchHistoryState,
} from "store/SearchHistory";
import { useDispatch, useSelector } from "react-redux";
import { ReactNode } from "react";

type SearchResultsProps = DefaultProps & {
  onClose: () => void;
  query: string;
  profilePubkeyResults: string[];
};

export default function SearchResults({
  onClose,
  query,
  profilePubkeyResults,
  ...rest
}: SearchResultsProps) {
  const dispatch = useDispatch();
  const { history } = useSelector(selectSearchHistoryState);

  if (!query && !history.length)
    return (
      <Box {...rest}>
        <Space h={60} />
        <Box mx="auto" c="white" w={40} h={40}>
          <SearchIcon width={40} height={40} />
        </Box>
        <Text mt="md" ta="center" c="white" fz="md">
          Search for profiles and hashtags
        </Text>
      </Box>
    );

  let results: ReactNode = null;

  if (query) {
    results = (
      <>
        <SearchResult type="hashtag" data={query} />
        {profilePubkeyResults.map((pubkey) => (
          <SearchResult type="profile" data={pubkey} />
        ))}
      </>
    );
  } else {
    results = (
      <>
        {history.map((item) => (
          <SearchResult type={item.type} data={item.data} />
        ))}
      </>
    );
  }

  return (
    <>
      {!query && history.length && (
        <Group position="apart" fz="md" fw="bold" mb={8}>
          <Text c="white">Recent searches</Text>
          <Button
            onClick={() => {
              dispatch(clearSearchHistory());
            }}
            fz="md"
            variant="subtle"
            c="purple.5"
          >
            Clear history
          </Button>
        </Group>
      )}
      <Stack onClick={onClose} {...rest}>
        {results}
      </Stack>
    </>
  );
}
