import { Flex, Stack, Text } from "@mantine/core";
import Head from "next/head";
import FeedHeader from "components/FeedHeader/FeedHeader";
import { useRouter } from "next/router";
import TagFeed from "../../components/TagFeed/TagFeed";
import { Route } from "../../enums";
import { ChevronLeftIcon } from "../../icons/StemstrIcon";
import BackButton from "../../components/BackButton/BackButton";
import useFooterHeight from "ndk/hooks/useFooterHeight";

export default function Tag() {
  const router = useRouter();
  const { tag } = router.query;
  const footerHeight = useFooterHeight();

  return (
    <>
      <Head>
        <title>Stemstr - #{tag}</title>
      </Head>
      <Stack spacing={0} h={`calc(100vh - ${footerHeight}px - 76px)`}>
        <FeedHeader>
          <Flex gap={12}>
            <BackButton defaultUrl={Route.Home}>
              <ChevronLeftIcon width={24} height={24} />
            </BackButton>
            <Text truncate>#{tag}</Text>
          </Flex>
        </FeedHeader>
        <TagFeed key={tag as string} tag={tag as string} />
      </Stack>
    </>
  );
}
