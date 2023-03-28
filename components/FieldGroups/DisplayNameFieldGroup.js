import DisplayNameField from "../Fields/DisplayNameField/DisplayNameField";
import FieldGroup from "./FieldGroup";

export default function DisplayNameFieldGroup(props) {
  return (
    <FieldGroup title="Display Name" titleFontSize="xs">
      <DisplayNameField {...props} />
    </FieldGroup>
  );
}
