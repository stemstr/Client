import { DrawerProps } from "components/Drawer/Drawer";
import SubscribeDrawer from "./SubscribeDrawer";
import {
  Button,
  Center,
  CopyButton,
  Group,
  Image,
  Loader,
  Text,
} from "@mantine/core";
import { useSubscribeWizard } from "./SubscribeWizardProvider";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CheckIcon,
  EllipsisIcon,
} from "icons/StemstrIcon";
import ProfileLink from "components/ProfileLink/ProfileLink";
import useLightningWalletUri from "hooks/useLightningWalletUri";
import { useEffect, useState } from "react";
import useAuth from "hooks/useAuth";
import { fetchSubscriptionStatus, setSubscriptionStatus } from "store/Auth";
import { useDispatch } from "react-redux";
import { isDesktop } from "react-device-detect";

type SubscribePaymentCompleteDrawerProps = DrawerProps & {
  onClose: () => void;
};

export default function SubscribePaymentCompleteDrawer({
  opened,
  onClose,
  ...rest
}: SubscribePaymentCompleteDrawerProps) {
  const { selectedPassOption, invoice } = useSubscribeWizard();
  const lightningWalletUri = useLightningWalletUri(invoice ?? "");
  const { authState, isSubscribed } = useAuth();
  const dispatch = useDispatch();
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [isPayWithWalletButtonLoading, setIsPayWithWalletButtonLoading] =
    useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timer | undefined;
    let interval: NodeJS.Timer | undefined;
    if (opened && !isPaymentComplete) {
      // poll subscription status after invoice has been generated
      timeout = setTimeout(() => {
        interval = setInterval(() => {
          refreshPaymentStatus();
        }, 3000);
      }, 5000);
    }
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [
    opened,
    authState.pk,
    dispatch,
    setSubscriptionStatus,
    isPaymentComplete,
  ]);

  useEffect(() => {
    if (isSubscribed()) {
      setIsPaymentComplete(true);
    }
  }, [authState.subscriptionStatus]);

  const refreshPaymentStatus = () => {
    if (authState.pk) {
      fetchSubscriptionStatus(authState.pk)
        .then((subscriptionStatus) => {
          if (subscriptionStatus.expires_at > Date.now() / 1000) {
            dispatch(setSubscriptionStatus(subscriptionStatus));
          }
        })
        .catch((err) => {});
    }
  };

  const willShowPayWithWalletButton = !isDesktop || window.webln;
  const handlePayWithWalletButtonClick = async () => {
    setIsPayWithWalletButtonLoading(true);

    if (window.webln) {
      try {
        await window.webln.enable();
        await window.webln.sendPayment(invoice as string);
        refreshPaymentStatus();
      } catch (error) {
        console.error(error);
      }

      setIsPayWithWalletButtonLoading(false);
    } else if (!isDesktop) {
      window.location.href = lightningWalletUri;
    }
  };

  return (
    <SubscribeDrawer opened={opened} onClose={onClose} {...rest}>
      <Text c="white" ta="center" fz={20} fw="bold" mt={8}>
        {isPaymentComplete ? "You're on your way!" : "Almost there!"}
      </Text>
      <Group spacing={4} mt={32} c="white">
        <ProfileLink size={42} />
        <ArrowRightIcon width={16} height={16} />
        <Image src="/logo.svg" width={42} />
      </Group>
      <Text c="white" fz={20} fw="bold" mt={24} lh={1}>
        {selectedPassOption?.priceSATS.toLocaleString()} sats
      </Text>
      <Text color="green.6" fz={50} fw="bold">
        {selectedPassOption?.numDays} days
      </Text>
      <Group spacing={10} mt="xs">
        <Center
          w={38}
          h={38}
          c={isPaymentComplete ? "green.5" : "gray.5"}
          sx={(theme) => ({
            border: "2px solid",
            borderRadius: "50%",
            backgroundColor: isPaymentComplete
              ? theme.fn.rgba(theme.colors.green[5], 0.15)
              : theme.fn.rgba(theme.colors.gray[5], 0.15),
          })}
        >
          {isPaymentComplete ? <CheckIcon /> : <EllipsisIcon />}
        </Center>
        <Text fz="sm" fw="bold">
          {isPaymentComplete ? "Payment successful" : "Awaiting payment..."}
        </Text>
      </Group>
      {isPaymentComplete && (
        <Text mt={40} fz="sm">
          You're good to go! Once your time is up, you can pay again to regain
          access to sharing and commenting on Stemstr.
        </Text>
      )}
      {isPaymentComplete ? (
        <Button onClick={onClose} mt={90} fullWidth>
          Let's go!
        </Button>
      ) : (
        <>
          <CopyButton value={lightningWalletUri}>
            {({ copied, copy }) => (
              <Button
                onClick={copy}
                disabled={!lightningWalletUri}
                variant="light"
                mt={90}
                fullWidth
              >
                {copied ? (
                  <>
                    Copied&nbsp;
                    <CheckCircleIcon width={14} height={14} />
                  </>
                ) : (
                  "Copy Invoice"
                )}
              </Button>
            )}
          </CopyButton>
          {willShowPayWithWalletButton && (
            <Button
              onClick={handlePayWithWalletButtonClick}
              disabled={!lightningWalletUri || isPayWithWalletButtonLoading}
              mt="md"
              fullWidth
            >
              Pay with Wallet
              {isPayWithWalletButtonLoading && (
                <>
                  &nbsp;
                  <Loader size={14} />
                </>
              )}
            </Button>
          )}
        </>
      )}
    </SubscribeDrawer>
  );
}
