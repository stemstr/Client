import { Button, DefaultProps, Group, TextInput } from "@mantine/core";
import { SearchIcon } from "icons/StemstrIcon";
import { Dispatch, SetStateAction } from "react";

type SearchBarProps = DefaultProps & {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  onClose: () => void;
};

export default function SearchBar({
  query,
  setQuery,
  onClose,
  ...rest
}: SearchBarProps) {
  return (
    <Group mb="md" {...rest}>
      <TextInput
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search profiles and hashtags"
        icon={<SearchIcon width={16} height={16} />}
        styles={(theme) => ({
          root: {
            flexGrow: 1,
          },
          icon: {
            color: theme.colors.gray[2],
          },
          input: {
            backgroundColor: theme.colors.gray[9],
            "&::placeholder": {
              color: theme.colors.gray[2],
            },
          },
        })}
        aria-label="Search profiles and hashtags"
      />
      <Button
        onClick={onClose}
        variant="light"
        px={16}
        aria-label="Cancel search"
      >
        Cancel
      </Button>
    </Group>
  );
}
