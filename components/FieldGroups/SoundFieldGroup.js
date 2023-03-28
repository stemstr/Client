import FieldGroup from "./FieldGroup";
import { StemIcon } from "../../icons/StemstrIcon";
import SoundPicker from "../Fields/SoundPicker/SoundPicker";

export default function SoundFieldGroup(props) {
  return (
    <FieldGroup TitleIcon={StemIcon} title="Sound">
      <SoundPicker {...props} />
    </FieldGroup>
  );
}
