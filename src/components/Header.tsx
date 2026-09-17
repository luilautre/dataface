"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { SignOutButton } from "@/components/SignOutButton";

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("status")
          .eq("id", user.id)
          .maybeSingle();
        setStatus(profile?.status ?? null);
      }
    };

    loadSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setStatus(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (pathname === "/login" || pathname === "/register" || pathname === "/pending") return null;

  const isAllowed = !!user && status === "approved";
  const navItems = [
    { href: "/", label: "Accueil", icon: "🏠" },
    { href: "/public-db", label: "Base publique", icon: "📊" },
    { href: "/my-db", label: "Ma base", icon: "📁" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={isAllowed ? "/" : "/login"} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-facebook-blue rounded-full flex items-center justify-center text-white font-bold text-xl">D</div>
          <span className="text-facebook-blue font-bold text-2xl hidden sm:block">DataFace</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={isAllowed ? item.href : "/login"} className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 text-facebook-muted hover:bg-gray-100">
              <span>{item.icon}</span><span className="hidden md:inline">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? <><Link href="/admin" className="text-sm text-facebook-blue hover:underline">Admin</Link><SignOutButton /></> : <><Link href="/login" className="text-sm text-facebook-blue hover:underline">Connexion</Link><Link href="/register" className="bg-facebook-blue text-white px-3 py-2 rounded-lg text-sm">S’inscrire</Link></>}
        </div>
      </div>
    </header>
  );
}
