"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { BackgroundProvider } from "@/contexts/BackgroundContext";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BackgroundProvider>
      <AuthProvider>
        {children}
        <Toaster position="top-center" />
      </AuthProvider>
    </BackgroundProvider>
  );
}
