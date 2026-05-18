import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { BackgroundProvider } from "@/contexts/BackgroundContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Omoide — ふたりだけの思い出アルバム",
  description: "カップルや家族が大切な瞬間を共有するプライベートな思い出アプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <BackgroundProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-center" />
          </AuthProvider>
        </BackgroundProvider>
      </body>
    </html>
  );
}
