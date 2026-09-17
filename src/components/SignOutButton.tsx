import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ProfileStatus = "pending" | "approved" | "rejected";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  status: ProfileStatus;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export async function getCurrentProfile() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile: profile as Profile | null };
}

export async function requireApprovedAccess() {
  const session = await getCurrentProfile();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.profile) {
    redirect("/register");
  }

  if (session.profile.status === "pending") {
    redirect("/pending");
  }

  if (session.profile.status === "rejected") {
    redirect("/login");
  }

  return session;
}

export async function requireAdminAccess() {
  const session = await requireApprovedAccess();

  if (!session.profile?.is_admin) {
    redirect("/");
  }

  return session;
}
