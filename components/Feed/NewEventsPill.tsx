import { Avatar, Center, Transition } from "@mantine/core";
import { NDKEvent, NDKFilter, NDKUser } from "@nostr-dev-kit/ndk";
import useStyles from "./NewEventsPill.styles";
import { useEffect, useState } from "react";
import { useNDK } from "../../ndk/NDKProvider";
import { getCachedUser } from "../../ndk/inMemoryCacheAdapter";
import useFooterHeight from "../../ndk/hooks/useFooterHeight";

interface NewEventsPillProps {
  filter: NDKFilter;
  eventsFilter?: (event: NDKEvent) => boolean;
  since: number;
  onClick: (events: NDKEvent[]) => void;
}

export function NewEventsPill({
  filter,
  eventsFilter = () => true,
  since,
  onClick,
}: NewEventsPillProps) {
  const { ndk, stemstrRelaySet } = useNDK();
  const { classes } = useStyles();
  const [events, setEvents] = useState<NDKEvent[]>([]);
  const [users, setUsers] = useState<NDKUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [willShow, setWillShow] = useState(false);
  const footerHeight = useFooterHeight();
  const handleClick = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    await onClick(events);
    setIsLoading(false);
    setEvents([]);
    setUsers([]);
    setWillShow(false);
  };

  useEffect(() => {
    if (!ndk) {
      return;
    }

    let timeoutId: NodeJS.Timeout;
    const sub = ndk.subscribe(
      { ...filter, since },
      { closeOnEose: false },
      stemstrRelaySet
    );

    sub.on("event", async (newEvent: NDKEvent) => {
      if (!eventsFilter(newEvent)) {
        return;
      }

      clearTimeout(timeoutId);

      const newUser =
        getCachedUser(newEvent.pubkey, ndk) ??
        ndk.getUser({ hexpubkey: newEvent.pubkey });

      if (!newUser.profile) {
        await newUser.fetchProfile();
      }

      setEvents((prev) => [...prev, newEvent]);
      setUsers((prev) => [...prev, newUser]);
      setWillShow(true);
      timeoutId = setTimeout(() => setWillShow(false), 10000);
    });

    return () => {
      if (sub) {
        sub.stop();
      }
    };
  }, [ndk, filter, eventsFilter, stemstrRelaySet, since]);

  return (
    <Transition transition="slide-up" mounted={willShow}>
      {(styles) => (
        <Center
          className={classes.newEventsPill}
          onClick={handleClick}
          style={styles}
          sx={{ bottom: footerHeight + 8 }}
        >
          {events.length > 0 && (
            <>
              {!isLoading && users.length > 0 && (
                <Avatar.Group spacing="sm">
                  {users.slice(0, 3).map((user, index) => (
                    <Avatar
                      key={index}
                      src={user.profile?.image}
                      alt={user.profile?.name}
                      size="md"
                      radius="xl"
                      styles={{ root: { borderColor: "white" } }}
                    />
                  ))}
                </Avatar.Group>
              )}
              {isLoading
                ? "loading..."
                : `${events.length} new note${events.length > 1 ? "s" : ""}`}
            </>
          )}
        </Center>
      )}
    </Transition>
  );
}
