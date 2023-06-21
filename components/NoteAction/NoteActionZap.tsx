import { ZapIcon } from "icons/StemstrIcon";
import requireAuth from "../../utils/hoc/requireAuth";
import NoteAction from "./NoteAction";

const NoteActionZap = () => {
  return (
    <NoteAction>
      <ZapIcon width={18} height={18} />
    </NoteAction>
  );
};

export default requireAuth(NoteActionZap);
