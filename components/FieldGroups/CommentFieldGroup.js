import FieldGroup from "./FieldGroup";
import { CommentIcon } from "../../icons/StemstrIcon";
import CommentField from "../Fields/CommentField/CommentField";

export default function CommentFieldGroup(props) {
  return (
    <FieldGroup TitleIcon={CommentIcon} title="Comment">
      <CommentField {...props} />
    </FieldGroup>
  );
}
