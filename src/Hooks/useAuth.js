import { useAuthContext } from "../Context/AuthContext";

export const useAuth = () => {
  return useAuthContext();
};
