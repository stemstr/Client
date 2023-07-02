import {
  Avatar,
  Box,
  Button,
  Center,
  CopyButton,
  Divider,
  Flex,
  Stack,
  Text,
} from "@mantine/core";
import QRCode from "qrcode.react";
import { useCallback, useEffect, useState } from "react";
import { isDesktop } from "react-device-detect";
import ZapDrawer from "./ZapDrawer";
import { createRelaySet, getNormalizedName } from "../../ndk/utils";
import { useUser } from "../../ndk/hooks/useUser";
import DrawerCloseButton from "./CloseButton";
import { useSelector } from "react-redux";
import { selectAuthState } from "../../store/Auth";
import { ArrowRightIcon, ProfileIcon } from "../../icons/StemstrIcon";
import { useZapWizard } from "./ZapWizardProvider";
import { useNDK } from "../../ndk/NDKProvider";
import { NDKEvent } from "@nostr-dev-kit/ndk";

interface InvoiceDrawerProps {
  isOpen: boolean;
  onClose: Function;
  amount: number;
  comment?: string;
  invoice: string;
  zapReceiptRelays: string[];
}

const InvoiceDrawer = ({
  isOpen,
  onClose,
  amount,
  comment,
  invoice,
  zapReceiptRelays,
}: InvoiceDrawerProps) => {
  const { ndk } = useNDK();
  const { zapRecipient, willShowCloseButton } = useZapWizard();
  const zapRecipientHexPubkey = zapRecipient.hexpubkey();
  const authState = useSelector(selectAuthState);
  const zapper = useUser(authState.pk);
  const [hasDetectedZapReceipt, setHasDetectedZapReceipt] = useState(false);
  const [willDisplayCopiedMessage, setWillDisplayCopiedMessage] =
    useState(false);
  const handleOnClose = useCallback(() => {
    setWillDisplayCopiedMessage(false);
    setHasDetectedZapReceipt(false);
    onClose();
  }, [onClose]);
  const InitialHeader = () => {
    const normalizedName = getNormalizedName(
      zapRecipient.hexpubkey(),
      zapRecipient
    );

    if (hasDetectedZapReceipt) {
      return isDesktop ? <>Zap sent to {normalizedName}</> : <>Zap sent</>;
    }

    return isDesktop ? (
      <>
        Ready to{" "}
        <Text span color="green.6" sx={{ lineHeight: "24px" }}>
          zap
        </Text>{" "}
        to {normalizedName}?
      </>
    ) : (
      <>Ready to zap?</>
    );
  };
  const Buttons = () => {
    return (
      <Flex gap={16}>
        <CopyButton value={invoice}>
          {({ copy }) => (
            <Button
              color="gray.6"
              onClick={() => {
                copy();
                setWillDisplayCopiedMessage(true);
                setTimeout(() => {
                  setWillDisplayCopiedMessage(false);
                }, 2000);
              }}
              fullWidth
              disabled={willDisplayCopiedMessage}
            >
              {willDisplayCopiedMessage ? "Copied" : "Copy Invoice"}
            </Button>
          )}
        </CopyButton>
        {!isDesktop && (
          <Button
            onClick={() => (window.location.href = `lightning:${invoice}`)}
            fullWidth
          >
            Pay with wallet
          </Button>
        )}
      </Flex>
    );
  };
  const getQrCodeImageSettings = () => {
    const defaultSettings = {
      height: 42,
      width: 42,
      excavate: false,
    };

    if (willDisplayCopiedMessage) {
      return {
        src: "/img/copied-to-clipboard.svg",
        ...defaultSettings,
      };
    }

    if (hasDetectedZapReceipt) {
      return {
        src: "/img/check-success.svg",
        ...defaultSettings,
      };
    }
  };
  const getSize = () => {
    if (isDesktop) {
      return hasDetectedZapReceipt ? 379 : 467;
    } else {
      return hasDetectedZapReceipt ? 312 : 352;
    }
  };

  useEffect(() => {
    if (!ndk || !isOpen || zapReceiptRelays.length === 0) {
      return;
    }

    const filter = {
      kinds: [9735],
      "#p": [zapRecipientHexPubkey],
      since: Math.round(Date.now() / 1000),
    };
    const subscription = ndk.subscribe(
      filter,
      { closeOnEose: false },
      createRelaySet(zapReceiptRelays, ndk)
    );

    subscription.on("event", (event: NDKEvent) => {
      if (event.tags.find((t) => t[0] === "bolt11" && t[1] === invoice)) {
        setHasDetectedZapReceipt(true);
        subscription.stop();
      }
    });

    return () => {
      if (subscription) {
        subscription.stop();
      }
    };
  }, [isOpen, zapReceiptRelays.length, ndk, invoice, zapRecipientHexPubkey]);

  return (
    <ZapDrawer isOpen={isOpen} onClose={handleOnClose} size={getSize()}>
      <Stack spacing={24} px={8}>
        <Text
          color="white"
          ta="center"
          size="xl"
          fw="bold"
          mt={8}
          sx={{ lineHeight: "24px" }}
        >
          <InitialHeader />
        </Text>
        <Flex justify="space-between" mb={hasDetectedZapReceipt ? 0 : 24}>
          <Box>
            <Flex gap={6} align="center" h={44}>
              <Avatar
                src={zapper?.profile?.image}
                alt={zapper?.profile?.name}
                size={42}
                radius="xl"
              >
                <ProfileIcon />
              </Avatar>
              <ArrowRightIcon width={16} height={16} />
              <Avatar
                src={zapRecipient?.profile?.image}
                alt={zapRecipient?.profile?.name}
                size={42}
                radius="xl"
              >
                <ProfileIcon />
              </Avatar>
            </Flex>
            <Text color={isDesktop ? "green.6" : "purple.4"} fz={50} fw="bold">
              {amount} sats
            </Text>
            <Text color="gray.1" fz="xs">
              {comment}
            </Text>
          </Box>
          {isDesktop && (
            <Center h={160} w={160} bg="white" sx={{ borderRadius: 10 }}>
              <QRCode
                size={144}
                value={invoice}
                imageSettings={getQrCodeImageSettings()}
              />
            </Center>
          )}
        </Flex>
        {!hasDetectedZapReceipt && <Buttons />}
        {willShowCloseButton && (
          <>
            <Divider color="gray.4" />
            <DrawerCloseButton onClick={handleOnClose} />
          </>
        )}
      </Stack>
    </ZapDrawer>
  );
};

export default InvoiceDrawer;