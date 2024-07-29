import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ExamMocker",
  description: "Take a mock test before your Exam",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster  richColors position="bottom-right"/>
        {children}
        </body>
    </html>
  );
}
