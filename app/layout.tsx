import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";

const Providers = dynamic(() => import("@/components/Providers"), { ssr: false });

export const metadata: Metadata = {
  title: "Omoide — ふたりだけの思い出アルバム",
  description: "カップルや家族が大切な瞬間を共有するプライベートな思い出アプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
