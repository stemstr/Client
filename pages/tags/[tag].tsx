import { Flex, Stack } from "@mantine/core";
import Head from "next/head";
import FeedHeader from "components/FeedHeader/FeedHeader";
import { useRouter } from "next/router";
import TagFeed from "../../components/TagFeed/TagFeed";
import { Route } from "../../enums";
import { ChevronLeftIcon } from "../../icons/StemstrIcon";
import BackButton from "../../components/BackButton/BackButton";

export default function Tag() {
  const router = useRouter();
  const { tag } = router.query;
  const title = `Stemstr - #${tag}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Stack spacing={0}>
        <FeedHeader>
          <Flex gap={12}>
            <BackButton defaultUrl={Route.Home}>
              <ChevronLeftIcon width={24} height={24} />
            </BackButton>
            {title}
          </Flex>
        </FeedHeader>
        <TagFeed tag={tag as string} />
      </Stack>
    </>
  );
}
