import {
  Button,
  Divider,
  Drawer as MantineDrawer,
  Flex,
  type MantineTheme,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { CommentIcon, ZapIcon } from "icons/StemstrIcon";
import requireAuth from "../../utils/hoc/requireAuth";
import NoteAction from "./NoteAction";
import { useState } from "react";
import withStopClickPropagation from "../../utils/hoc/withStopClickPropagation";
import { useUser } from "../../ndk/hooks/useUser";
import { useEvent } from "../../ndk/NDKEventProvider";
import { getNormalizedName } from "../../ndk/utils";
import SatsButton from "./SatsButton";
import useGetBtcPrice from "./useGetBtcPrice";
import FieldGroup from "../FieldGroups/FieldGroup";

const Drawer = withStopClickPropagation(MantineDrawer);

const NoteActionZap = () => {
  const { event } = useEvent();
  const user = useUser(event.pubkey);
  const [isOpen, setIsOpen] = useState(false);
  const [satsAmount, setSatsAmount] = useState(0);
  const hasChosenValidSatsAmount = satsAmount > 0;
  const btcPrice = useGetBtcPrice(isOpen);
  const handleOnClick = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
    setSatsAmount(0);
  };

  return (
    <NoteAction onClick={handleOnClick}>
      <ZapIcon width={18} height={18} />
      <Drawer
        opened={isOpen}
        onClose={handleClose}
        position="bottom"
        withCloseButton={false}
        trapFocus={false}
        size={578}
        styles={(theme: MantineTheme) => ({
          overlay: {
            backgroundColor: `${theme.colors.dark[7]} !important`,
            backdropFilter: "blur(16px)",
            opacity: `${0.5} !important`,
          },
          drawer: {
            backgroundColor: theme.colors.dark[8],
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            maxWidth: 600,
            margin: "auto",
            padding: "50px 16px !important",
          },
        })}
      >
        <Stack spacing={21}>
          <Text color="white" ta="center" size="xl" fw="bold">
            ⚡️ Send{" "}
            <Text span color="purple.6">
              sats
            </Text>{" "}
            to {getNormalizedName(event.pubkey, user)}
          </Text>
          <Flex justify="space-between" px={64}>
            {[500, 1000, 2000].map((_satsAmount) => (
              <SatsButton
                key={_satsAmount}
                satsAmount={_satsAmount}
                btcPrice={btcPrice}
                onClick={() => setSatsAmount(_satsAmount)}
                isHighlighted={_satsAmount === satsAmount}
              />
            ))}
          </Flex>
          <Flex justify="space-between" px={64}>
            {[4000, 6000].map((_satsAmount) => (
              <SatsButton
                key={_satsAmount}
                satsAmount={_satsAmount}
                btcPrice={btcPrice}
                onClick={() => setSatsAmount(_satsAmount)}
                isHighlighted={_satsAmount === satsAmount}
              />
            ))}
            <SatsButton satsAmount="Custom" />
          </Flex>
          <FieldGroup
            TitleIcon={CommentIcon}
            title="Comment"
            iconSize={16}
            disabled={!hasChosenValidSatsAmount}
          >
            <TextInput
              placeholder="Share some zappreciation"
              disabled={!hasChosenValidSatsAmount}
            />
          </FieldGroup>
          <Button mt={24} disabled={!hasChosenValidSatsAmount} fullWidth>
            Continue
          </Button>
          <Divider color="gray.4" />
        </Stack>
        <Flex justify="center" mt={10}>
          <Button
            variant="subtle"
            styles={(theme) => ({
              root: {
                color: theme.white,
                "&:hover": {
                  backgroundColor: "transparent",
                },
              },
            })}
            onClick={handleClose}
          >
            Close
          </Button>
        </Flex>
      </Drawer>
    </NoteAction>
  );
};

export default requireAuth(NoteActionZap);
