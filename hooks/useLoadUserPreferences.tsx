import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserPreferences } from "../utils/userPreferences";
import { setUserPreferences } from "../store/UserPreferences";

export default function useLoadUserPreferences() {
  const dispatch = useDispatch();

  useEffect(() => {
    getUserPreferences()
      .then((userPreferences) => {
        if (userPreferences) {
          dispatch(setUserPreferences(userPreferences));
        }
      })
      .catch(console.error);
  }, [dispatch]);
}
