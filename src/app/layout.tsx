"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { publicColumns, publicRows, type Row } from "@/lib/mockData";

export default function PublicDbPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string>("id");
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
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

      if (!profile || profile.status !== "approved") {
        router.push("/pending");
        return;
      }

      setLoading(false);
    };

    checkAccess();
  }, [router]);

  const filtered = publicRows
    .filter((row) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return Object.values(row).some((v) => String(v).toLowerCase().includes(q));
    })
    .sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === "number" && typeof vb === "number") {
        return sortAsc ? va - vb : vb - va;
      }
      return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  if (loading) return <div className="py-12 text-center text-facebook-muted">Vérification de l’accès...</div>;

  return (
    <div className="py-4 space-y-4">
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-facebook-text">📊 Base de données publique</h1>
            <p className="text-sm text-facebook-muted mt-1">
              Tableau partagé type Excel – utilisable par tous. Créez votre propre version liée dans <Link href="/my-db" className="text-facebook-blue underline">Ma base</Link>.
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-facebook-blue"
            />
            <Link href="/my-db" className="bg-facebook-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-facebook-dark whitespace-nowrap">
              Créer ma base →
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-facebook-gray border-b border-gray-200">
                {publicColumns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-left font-semibold text-facebook-text cursor-pointer hover:bg-gray-200 select-none"
                  >
                    {col.label}
                    {sortKey === col.key && <span className="ml-1">{sortAsc ? "↑" : "↓"}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={String(row.id)} className={`border-b border-gray-100 hover:bg-facebook-light ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  {publicColumns.map((col) => (
                    <td key={col.key} className="px-4 py-2.5 text-facebook-text">
                      {String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-sm text-facebook-muted">
          {filtered.length} ligne(s) affichée(s)
        </div>
      </div>
    </div>
  );
}
