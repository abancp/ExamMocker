import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "JEE MockTest",
  description: "Best Jee Mock Test for JEE",
};

export default function RootLayout({ children }) {
  return (
      <div className="bg-white text-black">{children}</div>
  );
}
