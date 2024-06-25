import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "JEE - ExamMocker",
  description: "JEE MockTest",
};

export default function RootLayout({ children }) {
  return (
      <div className={inter.className}>{children}</div>
  );
}