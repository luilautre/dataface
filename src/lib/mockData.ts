export type User = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  location?: string;
};

export type Post = {
  id: string;
  authorId: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
};

export type Column = {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "boolean";
};

export type Row = Record<string, string | number | boolean>;

export const users: User[] = [
  {
    id: "me",
    name: "Vous",
    avatar: "U",
    bio: "Utilisateur de DataFace – j'explore les bases de données publiques et crée les miennes.",
    location: "Paris, France",
  },
  {
    id: "alice",
    name: "Alice Martin",
    avatar: "A",
    bio: "Passionnée de données ouvertes et de réseaux sociaux.",
    location: "Lyon",
  },
  {
    id: "bob",
    name: "Bob Dupont",
    avatar: "B",
    bio: "Développeur et analyste de données.",
    location: "Marseille",
  },
];

export const posts: Post[] = [
  {
    id: "1",
    authorId: "alice",
    content: "Je viens d'ajouter 50 nouvelles lignes à la base publique de contacts ! Qui veut en créer une version personnelle ?",
    timestamp: "Il y a 2 heures",
    likes: 24,
    comments: 5,
  },
  {
    id: "2",
    authorId: "bob",
    content: "La base publique est super pour démarrer un projet. J'ai cloné la structure et ajouté mes propres colonnes de suivi.",
    timestamp: "Il y a 5 heures",
    likes: 18,
    comments: 3,
  },
  {
    id: "3",
    authorId: "me",
    content: "Bienvenue sur DataFace ! Le feed ressemble à Facebook, et vous pouvez explorer la base publique puis créer votre propre base liée.",
    timestamp: "Il y a 1 jour",
    likes: 42,
    comments: 12,
  },
  {
    id: "4",
    authorId: "alice",
    content: "Astuce : dans Ma base, vous pouvez importer la structure de la base publique et l'enrichir avec vos données privées.",
    timestamp: "Il y a 2 jours",
    likes: 31,
    comments: 7,
  },
];

// Public database – Excel-like (sample: contact directory / CRM light)
export const publicColumns: Column[] = [
  { key: "id", label: "ID", type: "number" },
  { key: "name", label: "Nom", type: "text" },
  { key: "email", label: "Email", type: "text" },
  { key: "company", label: "Entreprise", type: "text" },
  { key: "role", label: "Rôle", type: "text" },
  { key: "city", label: "Ville", type: "text" },
  { key: "score", label: "Score", type: "number" },
];

export const publicRows: Row[] = [
  { id: 1, name: "Marie Curie", email: "marie@example.com", company: "Science Lab", role: "Chercheuse", city: "Paris", score: 95 },
  { id: 2, name: "Jean Dupont", email: "jean@example.com", company: "TechCorp", role: "Ingénieur", city: "Lyon", score: 82 },
  { id: 3, name: "Sophie Bernard", email: "sophie@example.com", company: "DataWorks", role: "Analyste", city: "Marseille", score: 88 },
  { id: 4, name: "Lucas Petit", email: "lucas@example.com", company: "OpenData", role: "Développeur", city: "Toulouse", score: 91 },
  { id: 5, name: "Emma Roux", email: "emma@example.com", company: "CloudNine", role: "PM", city: "Nantes", score: 76 },
  { id: 6, name: "Hugo Moreau", email: "hugo@example.com", company: "AI Start", role: "Data Scientist", city: "Bordeaux", score: 94 },
  { id: 7, name: "Léa Fontaine", email: "lea@example.com", company: "GreenTech", role: "Designer", city: "Lille", score: 79 },
  { id: 8, name: "Nathan Blanc", email: "nathan@example.com", company: "FinServe", role: "Consultant", city: "Strasbourg", score: 85 },
];
