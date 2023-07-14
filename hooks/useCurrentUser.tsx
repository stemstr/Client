import { useSelector } from "react-redux";
import { AppState } from "../store/Store";
import { useUser } from "../ndk/hooks/useUser";

export default function useCurrentUser() {
  const authState = useSelector((state: AppState) => state.auth);

  return useUser(authState.pk);
}
