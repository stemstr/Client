import { Stack } from "@mantine/core";
import UserCard from "components/UserCard/UserCard";

type SearchResultsProps = {
  profilePubkeyResults: string[];
};

export default function SearchResults({
  profilePubkeyResults,
}: SearchResultsProps) {
  return (
    <Stack>
      {profilePubkeyResults.map((pubkey) => (
        <UserCard key={pubkey} pubkey={pubkey} />
      ))}
    </Stack>
  );
}
