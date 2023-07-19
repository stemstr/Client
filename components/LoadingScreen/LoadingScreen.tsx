import { Box, Center, Group, Stack, Text } from "@mantine/core";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const iconSize = 180;
  const barWidth = 8;
  const maxBarHeight = 95;
  const bars = [0.25, 0.2, 0.65, 1, 0.45];
  const borderWidth = 4;

  return (
    <Center
      sx={(theme) => ({
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: "auto",
        maxWidth: 600,
      })}
    >
      <Stack>
        <Center
          w={iconSize}
          h={iconSize}
          bg="purple.5"
          sx={{
            borderRadius: "50%",
            background:
              "linear-gradient(143deg, rgb(108, 61, 177) 0%, rgb(148, 96, 205) 100%)",
          }}
        >
          <Center
            w={iconSize - borderWidth}
            h={iconSize - borderWidth}
            sx={{
              borderRadius: "50%",
              background:
                "linear-gradient(143deg, rgb(125, 100, 163) 0%, rgba(103, 47, 183, 1) 100%)",
            }}
          >
            <Group spacing="sm">
              {bars.map((height, index) => (
                <Box key={index} w={barWidth}>
                  <Delay delay={index * 200}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{
                        height: [
                          height * maxBarHeight,
                          height * maxBarHeight * 0.5,
                          height * maxBarHeight,
                        ],
                        opacity: [0, 1, 0.5, 1, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                      }}
                    >
                      <Box
                        w="100%"
                        h="100%"
                        bg="white"
                        sx={{ borderRadius: barWidth / 2 }}
                      />
                    </motion.div>
                  </Delay>
                </Box>
              ))}
            </Group>
          </Center>
        </Center>
        <Text m="auto" c="white" fz={40} fw="bold">
          Stemstr
        </Text>
      </Stack>
    </Center>
  );
}

const Delay = ({ children, delay }: any) => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setDone(true), delay);
    return () => clearTimeout(showTimer);
  }, []);

  return done ? <>{children}</> : null;
};
