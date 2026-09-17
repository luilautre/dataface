"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message ?? "Impossible de créer le compte.");
      setLoading(false);
      return;
    }

    router.push("/pending");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-facebook-text mb-2">Créer un compte</h1>
        <p className="text-sm text-facebook-muted mb-6">Ton compte sera accessible après validation par l’administrateur.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="text" placeholder="Nom complet" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          <input required minLength={6} type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="w-full bg-facebook-blue text-white py-3 rounded-lg font-medium disabled:opacity-60">
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>
        <p className="text-sm text-facebook-muted mt-6 text-center">Déjà inscrit ? <Link href="/login" className="text-facebook-blue underline">Connexion</Link></p>
      </div>
    </div>
  );
}
