import { useContext } from "react";
import { NostrContext } from "../NostrProvider";

export default function useNostr() {
  return useContext(NostrContext);
}
