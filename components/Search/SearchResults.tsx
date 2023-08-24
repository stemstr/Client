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
  SearchResultType,
  reset as clearSearchHistory,
  selectSearchHistoryState,
} from "store/SearchHistory";
import { useDispatch, useSelector } from "react-redux";
import { ReactNode } from "react";

type SearchResultsProps = DefaultProps & {
  query: string;
  profilePubkeyResults: string[];
};

export default function SearchResults({
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
  const showSearchHistory = !query && history.length;
  if (showSearchHistory) {
    results = (
      <>
        {history.map((item) => (
          <SearchResult
            key={getSearchResultKey(item.type, item.data)}
            type={item.type}
            data={item.data}
          />
        ))}
      </>
    );
  } else {
    results = (
      <>
        <SearchResult
          key={getSearchResultKey("hashtag", query)}
          type="hashtag"
          data={query}
        />
        {profilePubkeyResults.map((pubkey) => (
          <SearchResult
            key={getSearchResultKey("profile", pubkey)}
            type="profile"
            data={pubkey}
          />
        ))}
      </>
    );
  }

  return (
    <Box {...rest}>
      {showSearchHistory && (
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
      <Stack spacing={8}>{results}</Stack>
    </Box>
  );
}

const getSearchResultKey = (type: SearchResultType, data: string) => {
  let key: string | undefined;
  switch (type) {
    case "hashtag":
      key = `#${data}`;
      break;
    case "profile":
      key = data;
      break;
  }
  return key;
};
