import { TextInput } from "@mantine/core";
import FieldGroup from "../FieldGroups/FieldGroup";
import { CommentIcon } from "../../icons/StemstrIcon";

interface ZapCommentFieldGroupProps {
  defaultValue?: string;
  onChange: (value: string) => void;
}

const ZapCommentFieldGroup = ({
  defaultValue,
  onChange,
}: ZapCommentFieldGroupProps) => (
  <FieldGroup TitleIcon={CommentIcon} title="Comment" iconSize={16}>
    <TextInput
      placeholder="Share some zappreciation"
      onChange={(e) => onChange(e.target.value)}
      defaultValue={defaultValue}
    />
  </FieldGroup>
);

export default ZapCommentFieldGroup;
