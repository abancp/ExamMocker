"use client";

import axios from "axios";
import SERVER_URL from "../config/serverUrl";
import useStore from "../store/store";
import { useEffect } from "react";

function useUserDetails() {
  const [setIsLogin, setUsername, setAdmin] = useStore((state) => [
    state.setIsLogin,
    state.setUsername,
    state.setAdmin,
  ]);

  useEffect(() => {
    axios
      .get(SERVER_URL + "/validate-token", { withCredentials: true })
      .then(({ data }) => {
        if (data.success && data.claims.username) {
          setIsLogin(true);
        }
        setUsername(data.claims.username);
        setAdmin(data.claims.admin);
      });
  }, []);
}

export default useUserDetails;
