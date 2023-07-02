import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Nip05Status,
  createNip05StatusKey,
  selectNip05State,
  setNip05Status,
} from "store/Nip05";

export default function useNip05(
  pubkey?: string,
  nip05?: string
): Nip05Status | undefined {
  const dispatch = useDispatch<any>();
  const nip05State = useSelector(selectNip05State);
  const key = createNip05StatusKey(pubkey ?? "", nip05 ?? "");

  useEffect(() => {
    const fetchNip05Status = async (pubkey: string, nip05: string) => {
      const [name, domain] = nip05.split("@");
      if (name && domain) {
        axios
          .get(`https://${domain}/.well-known/nostr.json?name=${name}`)
          .then((response) => {
            if (response.data.names[name] === pubkey) {
              dispatch(setNip05Status({ key, value: Nip05Status.Valid }));
            } else {
              dispatch(setNip05Status({ key, value: Nip05Status.Invalid }));
            }
          })
          .catch((err) => {
            dispatch(setNip05Status({ key, value: Nip05Status.Invalid }));
          });
      } else {
        dispatch(setNip05Status({ key, value: Nip05Status.Invalid }));
      }
    };

    if (pubkey && nip05 && nip05State[key] === undefined) {
      fetchNip05Status(pubkey, nip05);
    }
  }, [pubkey, nip05, nip05State[key]]);

  return nip05State[key];
}
