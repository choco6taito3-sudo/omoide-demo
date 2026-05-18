"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusSquare, User } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "ホーム" },
  { href: "/post/new", icon: PlusSquare, label: "投稿" },
  { href: "/profile", icon: User, label: "プロフィール" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 transition ${
                active ? "text-omoide-coral" : "text-omoide-muted"
              }`}
            >
              <Icon className={`w-6 h-6 ${active ? "fill-omoide-pink stroke-omoide-coral" : ""}`} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-xs">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
