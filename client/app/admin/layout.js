import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "JEE - ExamMocker",
  description: "JEE MockTest",
};

export default function RootLayout({ children }) {
  return (
      <div className="bg-[#090917]">{children}</div>
  );
}