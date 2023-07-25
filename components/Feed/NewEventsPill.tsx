import { Avatar, Center, Transition } from "@mantine/core";
import { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";
import useStyles from "./NewEventsPill.styles";
import { useEffect, useState } from "react";
import { useNDK } from "../../ndk/NDKProvider";
import { getCachedUser } from "../../ndk/inMemoryCacheAdapter";
import useFooterHeight from "../../ndk/hooks/useFooterHeight";

interface NewEventsPillProps {
  onClick: (events: NDKEvent[]) => void;
}

export function NewEventsPill({ onClick }: NewEventsPillProps) {
  const { ndk } = useNDK();
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
  };

  useEffect(() => {
    if (!ndk) {
      return;
    }

    // TODO: remove this and replace with real subscription once POC approved
    setTimeout(async () => {
      const newEvent = new NDKEvent(ndk, {
        created_at: 1686870409,
        content:
          "Okay here's my beat that I made with MusicLM. Hopefully someone can turn it into a banger.",
        tags: [
          ["client", "stemstr.app"],
          ["stemstr_version", "1.0"],
          [
            "download_url",
            "https://api.stemstr.app/download/f28fb7b59ea39a8126691c87ca13bdf5f529da931e3e25cc1d17098659b1fdbb",
          ],
          [
            "stream_url",
            "https://api.stemstr.app/stream/f28fb7b59ea39a8126691c87ca13bdf5f529da931e3e25cc1d17098659b1fdbb.m3u8",
          ],
        ],
        kind: 1808,
        pubkey:
          "604e96e099936a104883958b040b47672e0f048c98ac793f37ffe4c720279eb2",
        id: "a56733715dba1fc8ddc32e791b3d69749b572647707903ee37b8bdd445d9c988",
        sig: "d406b99710853ce0d38294d3664a4f4022fa6f3a85dc60a88274a43b070b15f9bdae8eb28178fefcaaf4b3e95c3313656fd1b7cd5b82eaaa749eff8f2ca15d3f",
      });
      const newUser =
        getCachedUser(newEvent.pubkey, ndk) ??
        ndk.getUser({ hexpubkey: newEvent.pubkey });

      if (!newUser.profile) {
        await newUser.fetchProfile();
      }

      setEvents((prev) => [...prev, newEvent]);
      setUsers((prev) => [...prev, newUser]);
      setWillShow(true);
      setTimeout(() => setWillShow(false), 10000);
    }, 5000);
  }, [ndk]);

  return (
    <Transition transition="slide-up" mounted={willShow}>
      {(styles) => (
        <Center
          className={classes.newEventsPill}
          onClick={handleClick}
          style={styles}
          sx={{ bottom: footerHeight + 8 }}
        >
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
            : `${events.length} new event${events.length > 1 ? "s" : ""}`}
        </Center>
      )}
    </Transition>
  );
}
