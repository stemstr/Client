import UserCard from "components/UserCard/UserCard";
import { forwardRef, memo, useMemo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, areEqual } from "react-window";

type UserFeedProps = {
  pubkeys: string[];
  height: string;
};

export default function UserFeed({ pubkeys, height }: UserFeedProps) {
  const GUTTER_HEIGHT = 16;

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
      const pubkey = useMemo(() => {
        return pubkeys[index];
      }, [index]);

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
    <AutoSizer
      style={{
        height: height,
      }}
    >
      {({ height, width }: { height: number; width: number }) => (
        <FixedSizeList
          height={height}
          itemCount={pubkeys.length}
          itemData={{ pubkeys: pubkeys }}
          itemSize={92 + GUTTER_HEIGHT}
          innerElementType={innerElementType}
          overscanCount={20}
          width={width}
        >
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
}
