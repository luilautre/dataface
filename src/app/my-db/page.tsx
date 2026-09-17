"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { publicColumns, publicRows, type Column, type Row } from "@/lib/mockData";

const STORAGE_KEY = "dataface-personal-db";

type PersonalDb = {
  name: string;
  columns: Column[];
  rows: Row[];
  linkedToPublic: boolean;
  createdAt: string;
};

export default function MyDbPage() {
  const [db, setDb] = useState<PersonalDb | null>(null);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDb(JSON.parse(raw));
    } catch {}
  }, []);

  const save = (next: PersonalDb | null) => {
    setDb(next);
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const createLinked = () => {
    const personal: PersonalDb = {
      name: newName || "Ma base personnelle",
      columns: [
        ...publicColumns,
        { key: "notes", label: "Notes perso", type: "text" },
        { key: "status", label: "Statut", type: "text" },
      ],
      rows: publicRows.map((r) => ({
        ...r,
        notes: "",
        status: "À traiter",
      })),
      linkedToPublic: true,
      createdAt: new Date().toISOString(),
    };
    save(personal);
    setEditing(false);
  };

  const createEmpty = () => {
    const personal: PersonalDb = {
      name: newName || "Ma base vide",
      columns: [
        { key: "id", label: "ID", type: "number" },
        { key: "name", label: "Nom", type: "text" },
        { key: "value", label: "Valeur", type: "text" },
      ],
      rows: [],
      linkedToPublic: false,
      createdAt: new Date().toISOString(),
    };
    save(personal);
    setEditing(false);
  };

  const updateCell = (rowIndex: number, key: string, value: string) => {
    if (!db) return;
    const nextRows = [...db.rows];
    nextRows[rowIndex] = { ...nextRows[rowIndex], [key]: value };
    save({ ...db, rows: nextRows });
  };

  const addRow = () => {
    if (!db) return;
    const maxId = db.rows.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0);
    const empty: Row = {};
    db.columns.forEach((c) => {
      empty[c.key] = c.key === "id" ? maxId + 1 : "";
    });
    save({ ...db, rows: [...db.rows, empty] });
  };

  const filtered = db
    ? db.rows.filter((row) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return Object.values(row).some((v) => String(v).toLowerCase().includes(q));
      })
    : [];

  if (!db) {
    return (
      <div className="py-8 max-w-xl mx-auto">
        <div className="bg-white rounded-xl shadow p-6 space-y-6">
          <div>
            <h1 className="text-xl font-bold text-facebook-text">📁 Ma base de données</h1>
            <p className="text-sm text-facebook-muted mt-2">
              Créez votre propre base liée à la base publique (même structure + colonnes personnelles) 
              ou une base vide. Les données sont sauvegardées localement dans votre navigateur.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-facebook-text mb-1">
              Nom de la base
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex: Mon CRM personnel"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-facebook-blue"
            />
          </div>

          <div className="grid gap-3">
            <button
              onClick={createLinked}
              className="w-full bg-facebook-blue text-white py-3 rounded-lg font-medium hover:bg-facebook-dark flex items-center justify-center gap-2"
            >
              🔗 Créer une base liée à la publique
            </button>
            <p className="text-xs text-facebook-muted text-center">
              Copie la structure + les données de la base publique, ajoute des colonnes Notes et Statut.
            </p>
            <button
              onClick={createEmpty}
              className="w-full bg-gray-200 text-facebook-text py-3 rounded-lg font-medium hover:bg-gray-300"
            >
              Créer une base vide
            </button>
          </div>

          <div className="text-center pt-2">
            <Link href="/public-db" className="text-facebook-blue text-sm hover:underline">
              Voir d&apos;abord la base publique →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-4">
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-facebook-text">📁 {db.name}</h1>
            <p className="text-sm text-facebook-muted mt-1">
              {db.linkedToPublic ? (
                <>
                  Liée à la{" "}
                  <Link href="/public-db" className="text-facebook-blue underline">
                    base publique
                  </Link>{" "}
                  · Créée le {new Date(db.createdAt).toLocaleDateString("fr-FR")}
                </>
              ) : (
                <>Base indépendante · Créée le {new Date(db.createdAt).toLocaleDateString("fr-FR")}</>
              )}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-facebook-blue"
            />
            <button
              onClick={addRow}
              className="bg-facebook-blue text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-facebook-dark"
            >
              + Ligne
            </button>
            <button
              onClick={() => {
                if (confirm("Supprimer définitivement cette base ?")) save(null);
              }}
              className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-facebook-gray border-b border-gray-200">
                {db.columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-3 text-left font-semibold text-facebook-text whitespace-nowrap"
                  >
                    {col.label}
                    {(col.key === "notes" || col.key === "status") && (
                      <span className="ml-1 text-xs text-facebook-blue">(perso)</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, rowIndex) => {
                const realIndex = db.rows.indexOf(row);
                return (
                  <tr
                    key={rowIndex}
                    className={`border-b border-gray-100 ${
                      rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    {db.columns.map((col) => (
                      <td key={col.key} className="px-2 py-1">
                        {col.key === "notes" || col.key === "status" || !db.linkedToPublic ? (
                          <input
                            type="text"
                            value={String(row[col.key] ?? "")}
                            onChange={(e) => updateCell(realIndex, col.key, e.target.value)}
                            className="w-full min-w-[100px] px-2 py-1.5 border border-transparent hover:border-gray-300 focus:border-facebook-blue rounded outline-none bg-transparent"
                          />
                        ) : (
                          <span className="px-2 py-1.5 block text-facebook-text">
                            {String(row[col.key] ?? "")}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-sm text-facebook-muted flex justify-between">
          <span>{filtered.length} ligne(s)</span>
          <span>Modifications sauvegardées automatiquement (localStorage)</span>
        </div>
      </div>
    </div>
  );
}
