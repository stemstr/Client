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
import { useCallback, useState } from "react";
import ZapDrawer from "./ZapDrawer";
import { getNormalizedName } from "../../ndk/utils";
import { useEvent } from "../../ndk/NDKEventProvider";
import { useUser } from "../../ndk/hooks/useUser";
import DrawerCloseButton from "./CloseButton";
import { useSelector } from "react-redux";
import { selectAuthState } from "../../store/Auth";
import { ArrowRightIcon, ProfileIcon } from "../../icons/StemstrIcon";

interface InvoiceDrawerProps {
  isOpen: boolean;
  onClose: Function;
  amount: number;
  comment?: string;
  invoice: string;
}

const InvoiceDrawer = ({
  isOpen,
  onClose,
  amount,
  comment,
  invoice,
}: InvoiceDrawerProps) => {
  const { event } = useEvent();
  const authState = useSelector(selectAuthState);
  const zapper = useUser(authState.pk);
  const zapRecipient = useUser(event.pubkey);
  const [hasCopiedInvoice, setHasCopiedInvoice] = useState(false);
  const handleOnClose = useCallback(() => {
    setHasCopiedInvoice(false);
    onClose();
  }, [onClose]);

  return (
    <ZapDrawer isOpen={isOpen} onClose={handleOnClose} size={467}>
      <Stack spacing={24} px={8}>
        <Text color="white" ta="center" size="xl" fw="bold">
          {hasCopiedInvoice ? (
            "Lightning invoice copied to clipboard"
          ) : (
            <>
              Ready to{" "}
              <Text span color="green.6">
                zap
              </Text>{" "}
              to {getNormalizedName(event.pubkey, zapRecipient)}?
            </>
          )}
        </Text>
        <Flex justify="space-between" mb={24}>
          <Box>
            <Flex gap={6} align="center">
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
            <Text color="green.6" fz={50} fw="bold">
              {amount} sats
            </Text>
            <Text color="gray.1" fz="xs">
              {comment}
            </Text>
          </Box>
          <Center h={160} w={160} bg="white" sx={{ borderRadius: 10 }}>
            <QRCode
              size={144}
              value={invoice}
              imageSettings={
                hasCopiedInvoice
                  ? {
                      src: "/img/copied-to-clipboard.svg",
                      height: 42,
                      width: 42,
                      excavate: false,
                    }
                  : undefined
              }
            />
          </Center>
        </Flex>
        <CopyButton value={invoice}>
          {({ copy }) => (
            <Button
              color="gray.6"
              onClick={() => {
                copy();
                setHasCopiedInvoice(true);
              }}
              fullWidth
            >
              Copy Invoice
            </Button>
          )}
        </CopyButton>
        <Divider color="gray.4" />
        <DrawerCloseButton onClick={handleOnClose} />
      </Stack>
    </ZapDrawer>
  );
};

export default InvoiceDrawer;
