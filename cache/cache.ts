// import { Metadata } from "../ndk/hooks/useProfile";
import { AuthState, setAuthState } from "../store/Auth";

const AUTH_KEY = "stemstr:cachedAuth";
// const PROFILES_KEY = "stemstr:cachedProfiles";

export const cacheAuthState = (state: AuthState | null) => {
  if (state === null) {
    localStorage.removeItem(AUTH_KEY);
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify(state));
};

export const getCachedAuth = () => {
  const localStorageData = localStorage.getItem(AUTH_KEY);

  if (!localStorageData) return null;

  const auth = JSON.parse(localStorageData);

  return auth;
};

// export const getCachedProfile = (npub: string) => {
//   const localStorageData = localStorage.getItem(PROFILES_KEY);

//   if (!localStorageData) return null;

//   const cachedProfiles: Record<string, Metadata> = JSON.parse(localStorageData);

//   return cachedProfiles[npub];
// };

// export const cacheProfile = (npub: string, profile: Metadata) => {
//   const localStorageData = localStorage.getItem(PROFILES_KEY);

//   let cachedProfiles: Record<string, Metadata> = {};

//   if (localStorageData) {
//     cachedProfiles = JSON.parse(localStorageData);
//   }

//   cachedProfiles[npub] = profile;

//   localStorage.setItem(PROFILES_KEY, JSON.stringify(cachedProfiles));
// };
