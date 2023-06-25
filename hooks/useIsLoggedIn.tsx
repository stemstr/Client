import { useSelector } from "react-redux";
import { selectAuthState } from "../store/Auth";

export const useIsLoggedIn = () => {
  const authState = useSelector(selectAuthState);

  return Boolean(authState.pk);
};
