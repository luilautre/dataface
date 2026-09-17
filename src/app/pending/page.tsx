"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { SignOutButton } from "@/components/SignOutButton";

export default function PendingPage() {
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase.from("profiles").select("status").eq("id", user.id).single();
      if (profile?.status === "approved") router.replace("/complete-profile");
      if (profile?.status === "rejected") router.replace("/login");
    };

    checkStatus();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-facebook-text mb-3">Compte en attente</h1>
        <p className="text-facebook-muted mb-6">L’administrateur doit valider ton compte. Tu pourras ensuite compléter ton profil avec une photo.</p>
        <SignOutButton />
      </div>
    </div>
  );
}
