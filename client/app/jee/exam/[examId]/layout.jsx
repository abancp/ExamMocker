"use client"
import "./globals.css";
import { useParams } from "next/navigation";



export default function RootLayout({ children }) {
  const {examId} = useParams()
  const channel = new BroadcastChannel(examId)
  channel.onmessage = function(e){
    if (e.data === "Are you open :)"){
      channel.postMessage("Yes, Iam Open :)")
    }
  }
  return (
      <div className="bg-white text-black">{children}</div>
  );
}
