import FieldGroup from "./FieldGroup";
import { TagsIcon } from "../../icons/StemstrIcon";
import TagsField from "../Fields/TagsField/TagsField";

export default function TagsFieldGroup(props) {
  return (
    <FieldGroup TitleIcon={TagsIcon} title="Tags">
      <TagsField {...props} />
    </FieldGroup>
  );
}
