import { Tabs } from "@mantine/core";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import UserCard from "components/UserCard/UserCard";
import { forwardRef, memo, useMemo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, areEqual } from "react-window";

type FollowersPanelProps = {
  contactList?: NDKEvent;
};

export default function FollowingPanel({ contactList }: FollowersPanelProps) {
  const headerHeight = 111;
  const GUTTER_HEIGHT = 16;
  const followingPubkeys: string[] = useMemo(
    () =>
      contactList?.tags.filter((tag) => tag[0] === "p").map((tag) => tag[1]) ||
      [],
    [contactList]
  );

  const Row = memo(
    ({
      data,
      index,
      style,
    }: {
      data: { pubkeys: string[] };
      index: number;
      style: Record<string, any>;
    }) => {
      const { pubkeys } = data;
      const pubkey = pubkeys[index];

      return (
        <UserCard
          key={pubkey}
          pubkey={pubkey}
          sx={{
            ...style,
            top: style.top + GUTTER_HEIGHT,
            height: style.height - GUTTER_HEIGHT,
          }}
        />
      );
    },
    areEqual
  );

  const innerElementType = forwardRef(({ style, ...rest }: any, ref) => (
    <div
      ref={ref}
      style={{
        ...style,
        paddingTop: GUTTER_HEIGHT,
      }}
      {...rest}
    />
  ));

  return (
    <Tabs.Panel value="following" pl="md" pr="md">
      <AutoSizer
        style={{
          height: `calc(100vh - ${headerHeight}px)`,
        }}
      >
        {({ height, width }: { height: number; width: number }) => (
          <FixedSizeList
            height={height}
            itemCount={followingPubkeys.length}
            itemData={{ pubkeys: followingPubkeys }}
            itemSize={104}
            innerElementType={innerElementType}
            overscanCount={20}
            width={width}
          >
            {Row}
          </FixedSizeList>
        )}
      </AutoSizer>
    </Tabs.Panel>
  );
}
