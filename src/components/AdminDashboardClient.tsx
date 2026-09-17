"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  status: "pending" | "approved" | "rejected";
  is_admin: boolean;
  created_at: string;
};

export function AdminDashboardClient() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfiles = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, status, is_admin, created_at")
      .order("created_at", { ascending: false });

    if (!error) setProfiles(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("profiles").update({ status }).eq("id", id);
    if (!error) loadProfiles();
  };

  if (loading) {
    return <p className="text-facebook-muted">Chargement du dashboard...</p>;
  }

  return (
    <div className="space-y-4">
      {profiles.length === 0 ? (
        <p className="text-facebook-muted">Aucun compte pour le moment.</p>
      ) : (
        profiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <div>
              <p className="font-semibold text-facebook-text">{profile.full_name || "Sans nom"}</p>
              <p className="text-sm text-facebook-muted">{profile.email}</p>
              <p className="text-xs text-facebook-muted">Statut : {profile.status}</p>
            </div>

            {!profile.is_admin && (
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(profile.id, "approved")}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                >
                  Valider
                </button>
                <button
                  onClick={() => updateStatus(profile.id, "rejected")}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  Refuser
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
