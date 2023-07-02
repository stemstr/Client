import { Flex, TextInput } from "@mantine/core";
import FieldGroup from "../FieldGroups/FieldGroup";
import { CommentIcon } from "../../icons/StemstrIcon";

interface ZapCommentFieldGroupProps {
  defaultValue?: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

const CommentInput = ({
  defaultValue,
  onChange,
  compact,
}: ZapCommentFieldGroupProps) => (
  <TextInput
    placeholder="Share some zappreciation"
    onChange={(e) => onChange(e.target.value)}
    defaultValue={defaultValue}
    w="100%"
    size={compact ? "xs" : "lg"}
    styles={{ input: { fontSize: compact ? 16 : 18 } }}
  />
);

const ZapCommentFieldGroup = ({
  defaultValue,
  onChange,
  compact = false,
}: ZapCommentFieldGroupProps) => {
  return compact ? (
    <Flex align="center" gap={8}>
      <CommentIcon w={16} h={16} />
      <CommentInput
        defaultValue={defaultValue}
        onChange={onChange}
        compact={compact}
      />
    </Flex>
  ) : (
    <FieldGroup TitleIcon={CommentIcon} title="Comment" iconSize={16}>
      <CommentInput defaultValue={defaultValue} onChange={onChange} />
    </FieldGroup>
  );
};

export default ZapCommentFieldGroup;
