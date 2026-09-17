"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { SignOutButton } from "@/components/SignOutButton";

export default function PendingPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string>("pending");

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("status")
        .eq("id", user.id)
        .single();

      if (profile?.status === "approved") router.push("/");
      setStatus(profile?.status ?? "pending");
    };

    load();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-facebook-text mb-3">Compte en attente</h1>
        <p className="text-facebook-muted mb-6">
          Ton inscription a bien été prise en compte. L’administrateur doit valider ton compte avant que tu puisses accéder au site.
        </p>
        <p className="text-sm text-facebook-blue font-medium mb-6">Statut : {status}</p>
        <SignOutButton />
      </div>
    </div>
  );
}
