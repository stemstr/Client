import { ActionIcon, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SearchIcon } from "icons/StemstrIcon";
import SearchModal from "./SearchModal";

export default function SearchButton() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Box>
      <SearchModal opened={opened} onClose={close} />
      <ActionIcon onClick={open} variant="transparent">
        <SearchIcon color="white" width={24} height={24} />
      </ActionIcon>
    </Box>
  );
}
