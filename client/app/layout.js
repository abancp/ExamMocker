"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });
import {useEffect} from "react"
import useStore from "../store/store"
import axios from "axios";
import SERVER_URL from "../config/serverUrl";

export default function RootLayout({ children }) {
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
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster richColors position="bottom-right" />
        {children}
      </body>
    </html>
  );
}
