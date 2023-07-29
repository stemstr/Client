import { Box, Group, Text, Transition } from "@mantine/core";
import ProfileLink from "components/ProfileLink/ProfileLink";
import useAuth from "hooks/useAuth";
import { useEffect, useMemo, useState } from "react";

export default function ProfileMenu() {
  const { authState } = useAuth();
  const [subscriptionTimeRemaining, setSubscriptionTimeRemaining] =
    useState<number>(); // in seconds
  const formattedSubscriptionTimeRemaining = useMemo(
    () =>
      subscriptionTimeRemaining
        ? formatTime(subscriptionTimeRemaining)
        : undefined,
    [subscriptionTimeRemaining]
  );
  const timeSinceSubscriptionStart =
    authState.subscriptionStatus?.created_at &&
    Date.now() / 1000 - authState.subscriptionStatus?.created_at;
  const isHighlightingSubscriptionStatus =
    timeSinceSubscriptionStart &&
    timeSinceSubscriptionStart > 0 &&
    timeSinceSubscriptionStart < 10;

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (authState.subscriptionStatus?.expires_at) {
      setSubscriptionTimeRemaining(
        authState.subscriptionStatus.expires_at - Date.now() / 1000
      );
      interval = setInterval(() => {
        if (authState.subscriptionStatus?.expires_at) {
          setSubscriptionTimeRemaining(
            authState.subscriptionStatus.expires_at - Date.now() / 1000
          );
        }
      }, 1000);
    } else {
      setSubscriptionTimeRemaining(undefined);
    }

    return () => {
      clearInterval(interval);
    };
  }, [authState.subscriptionStatus?.expires_at, setSubscriptionTimeRemaining]);

  return (
    <Group
      spacing={8}
      sx={(theme) => ({
        border: "1px solid",
        borderColor: isHighlightingSubscriptionStatus
          ? theme.colors.green[5]
          : theme.colors.gray[2],
        outline: "3px solid",
        outlineColor: isHighlightingSubscriptionStatus
          ? theme.colors.green[8]
          : theme.colors.gray[4],
        padding: 3,
        borderRadius: 19,
        transition: "border-color .5s ease, outline-color .5s ease",
      })}
    >
      <Transition
        mounted={Boolean(formattedSubscriptionTimeRemaining)}
        transition="slide-left"
        duration={500}
        timingFunction="ease"
      >
        {(styles) => (
          <Box
            c={isHighlightingSubscriptionStatus ? "green" : "white"}
            style={{
              ...styles,
              cursor: "pointer",
              transition: "color .5s ease",
            }}
          >
            <Text fw="bold" ml={10} span>
              {formattedSubscriptionTimeRemaining?.amount}
            </Text>{" "}
            {formattedSubscriptionTimeRemaining?.unit}
          </Box>
        )}
      </Transition>
      <ProfileLink size={30} />
    </Group>
  );
}

const formatTime = (seconds: number): { amount: number; unit: string } => {
  if (seconds < 3600) {
    const minutes = Math.ceil(seconds / 60);
    return {
      amount: minutes,
      unit: `min.`,
    };
  } else if (seconds < 86400) {
    const hours = Math.ceil(seconds / 3600);
    return {
      amount: hours,
      unit: `hr${hours === 1 ? "" : "s"}.`,
    };
  } else {
    const days = Math.ceil(seconds / 86400);
    return {
      amount: days,
      unit: `day${days === 1 ? "" : "s"}`,
    };
  }
};
