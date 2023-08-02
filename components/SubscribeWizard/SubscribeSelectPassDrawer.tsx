import { DrawerProps } from "components/Drawer/Drawer";
import SubscribeDrawer from "./SubscribeDrawer";
import { Box, Button, Group, Loader, Radio, Stack, Text } from "@mantine/core";
import { ChevronLeftIcon } from "icons/StemstrIcon";
import { useCallback, useEffect, useState } from "react";
import { PassOption, useSubscribeWizard } from "./SubscribeWizardProvider";
import { fetchSubscriptionInvoice } from "store/Auth";
import useAuth from "hooks/useAuth";

type SubscribeSelectPassDrawerProps = DrawerProps & {
  onBack: () => void;
  onContinue: () => void;
};

type PassOptionInputProps = PassOption & {
  value: string;
  selected: boolean;
};

export default function SubscribeSelectPassDrawer({
  opened,
  onClose,
  onBack,
  onContinue,
  ...rest
}: SubscribeSelectPassDrawerProps) {
  const { authState } = useAuth();
  const {
    selectedPassOption,
    setSelectedPassOption,
    passOptions,
    invoice,
    setInvoice,
    selectedPass,
    setSelectedPass,
    isFetchingInvoice,
    setIsFetchingInvoice,
  } = useSubscribeWizard();

  useEffect(() => {
    const index = parseInt(selectedPass);
    setSelectedPassOption(passOptions[index]);
  }, [selectedPass, passOptions]);

  useEffect(() => {
    setInvoice(undefined);
  }, [selectedPassOption]);

  const fetchInvoice = useCallback(() => {
    setInvoice(undefined);
    if (!authState.pk || !selectedPassOption?.numDays) {
      return;
    }
    setIsFetchingInvoice(true);
    fetchSubscriptionInvoice(authState.pk, selectedPassOption.numDays)
      .then((response) => {
        setInvoice(response.lightning_invoice);
      })
      .catch((err) => {
        setInvoice(undefined);
      })
      .finally(() => {
        setIsFetchingInvoice(false);
      });
  }, [
    authState.pk,
    selectedPassOption?.numDays,
    setInvoice,
    setIsFetchingInvoice,
  ]);

  useEffect(() => {
    if (invoice) {
      onContinue();
    }
  }, [invoice]);

  const handleChange = (value: string) => {
    setSelectedPass(value);
  };

  return (
    <SubscribeDrawer opened={opened} onClose={onClose} {...rest}>
      <Box pos="relative" c="white" mt={8} h={20}>
        <Text
          pos="absolute"
          top={0}
          left={0}
          right={0}
          ta="center"
          fz={20}
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
          <ChevronLeftIcon width={20} height={20} />
        </Box>
      </Box>
      <Radio.Group
        name="pass"
        value={selectedPass}
        onChange={handleChange}
        orientation="vertical"
        mt="md"
        spacing="md"
        sx={{ flexDirection: "column" }}
      >
        {passOptions.map((passOption, index) => (
          <PassOptionInput
            key={index}
            value={`${index}`}
            selected={selectedPass === `${index}`}
            {...passOption}
          />
        ))}
      </Radio.Group>
      <Button
        onClick={fetchInvoice}
        mt={52}
        disabled={isFetchingInvoice || !selectedPassOption}
        fullWidth
      >
        {isFetchingInvoice && (
          <>
            <Loader size={14} />
            &nbsp;
          </>
        )}
        Continue to Payment
      </Button>
    </SubscribeDrawer>
  );
}

const PassOptionInput = ({
  value,
  numDays,
  priceSATS,
  priceUSD,
  selected,
}: PassOptionInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setIsFocused(false);
  }, []);

  return (
    <Radio
      value={value}
      label={
        <Group position="apart">
          <Text c="white" fz={20} fw={700}>
            {numDays} day{numDays > 1 && "s"}
          </Text>
          <Stack spacing={4}>
            <Text ta="right">
              <Text c="green.5" fz={20} fw={700} span>
                {priceSATS.toLocaleString()}
              </Text>{" "}
              SATS
            </Text>
            <Text ta="right">
              ~
              {priceUSD
                ? priceUSD.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                : "$-.--"}{" "}
              USD
            </Text>
          </Stack>
        </Group>
      }
      styles={(theme) => ({
        labelWrapper: { width: "100%" },
        label: {
          padding: `4px ${theme.spacing.md}px`,
          borderRadius: theme.radius.lg,
          outline: isFocused
            ? `2px solid ${theme.colors.purple[5]}`
            : undefined,
          outlineOffset: 2,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: selected ? theme.white : theme.colors.gray[4],
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
