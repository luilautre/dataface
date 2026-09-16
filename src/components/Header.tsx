"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Accueil", icon: "🏠" },
    { href: "/public-db", label: "Base publique", icon: "📊" },
    { href: "/my-db", label: "Ma base", icon: "📁" },
    { href: "/profile/me", label: "Profil", icon: "👤" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-facebook-blue rounded-full flex items-center justify-center text-white font-bold text-xl">
            D
          </div>
          <span className="text-facebook-blue font-bold text-2xl hidden sm:block">
            DataFace
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                  active
                    ? "bg-facebook-light text-facebook-blue"
                    : "text-facebook-muted hover:bg-gray-100"
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
