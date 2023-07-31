import { Box, Center, Group, Text, Transition } from "@mantine/core";
import ProfileLink from "components/ProfileLink/ProfileLink";
import useAuth from "hooks/useAuth";
import { InfinityIcon, StarsSolidIcon } from "icons/StemstrIcon";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
  const isHighlightingSubscriptionStatus = Boolean(
    timeSinceSubscriptionStart &&
      timeSinceSubscriptionStart > 0 &&
      timeSinceSubscriptionStart < 20
  );

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
      pos="relative"
      sx={(theme) => ({
        color: isHighlightingSubscriptionStatus
          ? theme.colors.green[5]
          : theme.white,
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
        transition:
          "color 0.5s ease, border-color 0.5s ease, outline-color 0.5s ease",
      })}
    >
      {true && <Stars mounted={isHighlightingSubscriptionStatus} />}
      <Transition
        mounted={Boolean(formattedSubscriptionTimeRemaining)}
        transition="slide-left"
        duration={500}
        timingFunction="ease"
      >
        {(styles) => (
          <Box
            style={{
              ...styles,
              cursor: "pointer",
            }}
          >
            {authState.subscriptionStatus?.expires_at === 21_000_000_000 ? (
              <Center ml={10}>
                <InfinityIcon width={20} height={20} />
              </Center>
            ) : (
              <>
                <Text fw="bold" ml={10} span>
                  {formattedSubscriptionTimeRemaining?.amount}
                </Text>{" "}
                {formattedSubscriptionTimeRemaining?.unit}
              </>
            )}
          </Box>
        )}
      </Transition>
      <ProfileLink size={30} />
    </Group>
  );
}

type StarSprite = {
  size: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

const Stars = ({ mounted }: { mounted: boolean }) => {
  const stars: StarSprite[] = [
    { size: 13, top: -4, left: 2 },
    { size: 11, top: -4, right: -4 },
    { size: 11, bottom: -4, right: 2 },
    { size: 11, bottom: -4, left: 8 },
  ];

  return (
    <>
      {stars.map((star, index) => (
        <AnimatePresence>
          {mounted && (
            <Box
              component={motion.div}
              initial={{ scale: 0, rotate: 0 }}
              animate={{
                scale: [0, 1.25, 1],
                rotate: [0, 360],
              }}
              exit={{ scale: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              key={index}
              sx={{ zIndex: 1 }}
              lh={0}
              pos="absolute"
              top={star.top}
              right={star.right}
              bottom={star.bottom}
              left={star.left}
            >
              <StarsSolidIcon width={star.size} height={star.size} />
            </Box>
          )}
        </AnimatePresence>
      ))}
    </>
  );
};

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
