import { Group, Text } from "@mantine/core";
import { useRouter } from "next/router";
import BackButton from "../../components/BackButton/BackButton";
import { ChevronLeftIcon } from "../../icons/StemstrIcon";
import { Route } from "../../enums/routes";
import Thread from "components/Thread/Thread";

export default function ThreadPage() {
  const router = useRouter();
  const { noteId } = router.query;

  return (
    <>
      <Group position="left" p="md" bg="dark.8">
        <Group spacing="sm" align="center" c="white">
          <BackButton defaultUrl={Route.Discover}>
            <ChevronLeftIcon width={24} height={24} />
          </BackButton>
          <Text
            onClick={() => router.reload()}
            c="white"
            fw="bold"
            fz={24}
            lh="normal"
            sx={{ cursor: "pointer" }}
          >
            Replies
          </Text>
        </Group>
      </Group>
      <Thread noteId={noteId as string} />
    </>
  );
}
