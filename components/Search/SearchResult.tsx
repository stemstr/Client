import { Anchor, Box, Center, Group, Text } from "@mantine/core";
import UserCard from "components/UserCard/UserCard";
import { Route } from "enums";
import { HashtagIcon } from "icons/StemstrIcon";
import Link from "next/link";
import { ReactNode } from "react";
import { useDispatch } from "react-redux";
import { SearchResultType, addSearchHistoryItem } from "store/SearchHistory";

type SearchResultProps = {
  type: SearchResultType;
  data: string;
};

export default function SearchResult({ type, data }: SearchResultProps) {
  const dispatch = useDispatch();

  const handleClick = () => {
    const searchHistoryItem = { type, data, timestamp: Date.now() / 1000 };
    dispatch(addSearchHistoryItem(searchHistoryItem));
  };

  let inner: ReactNode = null;
  switch (type) {
    case "hashtag":
      inner = <HashtagResult query={data} />;
      break;
    case "profile":
      inner = <UserCard pubkey={data} showFollowButton={false} />;
      break;
  }

  return <Box onClick={handleClick}>{inner}</Box>;
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
      display="block"
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
