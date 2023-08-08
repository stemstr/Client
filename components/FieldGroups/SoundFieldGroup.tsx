import FieldGroup from "./FieldGroup";
import { StemIcon } from "../../icons/StemstrIcon";
import SoundPicker, {
  SoundPickerProps,
} from "../Fields/SoundPicker/SoundPicker";

export default function SoundFieldGroup(props: SoundPickerProps) {
  return (
    <FieldGroup TitleIcon={StemIcon} title="Sound">
      <SoundPicker {...props} />
    </FieldGroup>
  );
}
