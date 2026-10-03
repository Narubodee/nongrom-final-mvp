import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NongRom — AI Weather Chatbot",
  description: "น้องร่ม AI Weather Chatbot สำหรับถามสภาพอากาศด้วยภาษาธรรมชาติ",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
