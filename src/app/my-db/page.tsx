"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Profile = {
  status: "pending" | "approved" | "rejected";
  full_name: string | null;
};

type Post = {
  id: string;
  content: string;
  created_at: string;
  profiles: { full_name: string | null } | null;
};

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProfileAndPosts = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("status, full_name")
      .eq("id", user.id)
      .single();

    if (!profileData) {
      router.push("/register");
      return;
    }

    if (profileData.status === "pending") {
      router.push("/pending");
      return;
    }

    if (profileData.status === "rejected") {
      router.push("/login");
      return;
    }

    setProfile(profileData);

    const { data: postsData } = await supabase
      .from("posts")
      .select("id, content, created_at, profiles(full_name)")
      .order("created_at", { ascending: false });

    setPosts(postsData ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadProfileAndPosts();
  }, [router]);

  const handleCreatePost = async (event: FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("posts").insert({
      author_id: user.id,
      content: content.trim(),
    });

    if (!error) {
      setContent("");
      loadProfileAndPosts();
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-facebook-muted">Chargement...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 py-4">
      <aside className="hidden lg:block lg:col-span-3 space-y-3">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-facebook-text mb-3">Raccourcis</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/public-db" className="flex items-center gap-2 text-facebook-muted hover:text-facebook-blue">
                📊 Base de données publique
              </Link>
            </li>
            <li>
              <Link href="/my-db" className="flex items-center gap-2 text-facebook-muted hover:text-facebook-blue">
                📁 Ma base personnelle
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <section className="lg:col-span-6 space-y-4">
        <div className="bg-white rounded-xl shadow p-4">
          <form onSubmit={handleCreatePost} className="space-y-3">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full bg-facebook-blue text-white flex items-center justify-center font-semibold">
                {profile?.full_name?.[0]?.toUpperCase() || "U"}
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder="Quoi de neuf ?"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-facebook-blue resize-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-facebook-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-facebook-dark"
              >
                Publier
              </button>
            </div>
          </form>
        </div>

        {posts.map((post) => (
          <article key={post.id} className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-facebook-blue text-white flex items-center justify-center font-semibold">
                {(post.profiles?.full_name ?? "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-facebook-text">{post.profiles?.full_name || "Utilisateur"}</p>
                <p className="text-xs text-facebook-muted">
                  {new Date(post.created_at).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
            </div>
            <p className="text-facebook-text whitespace-pre-wrap">{post.content}</p>
          </article>
        ))}
      </section>

      <aside className="hidden lg:block lg:col-span-3 space-y-3">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-facebook-text mb-2">Compte</h2>
          <p className="text-sm text-facebook-muted">Statut : validé</p>
          <p className="text-sm text-facebook-muted">Bienvenue {profile?.full_name || "utilisateur"}</p>
        </div>
      </aside>
    </div>
  );
}
