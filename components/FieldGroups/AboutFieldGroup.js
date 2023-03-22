import AboutField from "../Fields/AboutField/AboutField";
import FieldGroup from "./FieldGroup";

export default function AboutFieldGroup(props) {
  return (
    <FieldGroup title="A bit about you" titleFontSize="xs">
      <AboutField {...props} />
    </FieldGroup>
  );
}
