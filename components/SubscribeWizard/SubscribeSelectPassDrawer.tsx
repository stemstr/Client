import { DrawerProps } from "components/Drawer/Drawer";
import SubscribeDrawer from "./SubscribeDrawer";
import { Box, Button, Group, Radio, Stack, Text } from "@mantine/core";
import { ChevronLeftIcon } from "icons/StemstrIcon";
import { useState } from "react";

type SubscribeSelectPassDrawerProps = DrawerProps & {
  onBack: () => void;
};

type PassOptionProps = {
  value: string;
  numDays: number;
  priceSATS: number;
  priceUSD: number;
  selected: boolean;
};

export default function SubscribeSelectPassDrawer({
  opened,
  onClose,
  onBack,
  ...rest
}: SubscribeSelectPassDrawerProps) {
  const [selectedPass, setSelectedPass] = useState("0");
  const passOptions = [
    { numDays: 1, priceSATS: 100, priceUSD: 0.02 },
    { numDays: 7, priceSATS: 1000, priceUSD: 0.2 },
    { numDays: 30, priceSATS: 10000, priceUSD: 2 },
    { numDays: 180, priceSATS: 60000, priceUSD: 12 },
  ];

  return (
    <SubscribeDrawer opened={opened} onClose={onClose} {...rest}>
      <Box pos="relative" c="white" mt={8} h={24}>
        <Text
          pos="absolute"
          top={0}
          left={0}
          right={0}
          ta="center"
          fz={24}
          fw="bold"
          lh={1}
        >
          Select a Share Pass
        </Text>
        <Box
          pos="absolute"
          top={0}
          left={0}
          onClick={onBack}
          sx={{ cursor: "pointer" }}
        >
          <ChevronLeftIcon width={24} height={24} />
        </Box>
      </Box>
      <Stack mt="md">
        <Radio.Group
          name="pass"
          value={selectedPass}
          onChange={setSelectedPass}
          orientation="vertical"
          sx={{ flexDirection: "column" }}
        >
          {passOptions.map((passOption, index) => (
            <PassOption
              key={index}
              value={`${index}`}
              selected={selectedPass === `${index}`}
              {...passOption}
            />
          ))}
        </Radio.Group>
      </Stack>
      <Button mt={64} variant="light" fullWidth>
        Copy Invoice
      </Button>
      <Button mt="md" fullWidth>
        Pay with Wallet
      </Button>
    </SubscribeDrawer>
  );
}

const PassOption = ({
  value,
  numDays,
  priceSATS,
  priceUSD,
  selected,
}: PassOptionProps) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <Radio
      value={value}
      label={
        <Group position="apart">
          <Text c="white" fz={20} fw={700}>
            {numDays} days
          </Text>
          <Stack spacing={4}>
            <Text ta="right">
              <Text c="green.5" fz={20} fw={500} span>
                {priceSATS.toLocaleString()}
              </Text>{" "}
              SATS
            </Text>
            <Text ta="right">
              ~
              {priceUSD.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}{" "}
              USD
            </Text>
          </Stack>
        </Group>
      }
      styles={(theme) => ({
        labelWrapper: { width: "100%" },
        label: {
          padding: theme.spacing.sm,
          borderRadius: theme.radius.lg,
          outline: isFocused
            ? `2px solid ${theme.colors.purple[5]}`
            : undefined,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor:
            selected && !isFocused ? theme.white : theme.colors.gray[4],
          cursor: "pointer",
        },
        inner: {
          opacity: 0,
          width: 0,
          height: 0,
        },
      })}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
};
