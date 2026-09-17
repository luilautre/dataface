import Link from "next/link";
import { users, posts } from "@/lib/mockData";
import { notFound } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = users.find((u) => u.id === id);
  if (!user) notFound();

  const userPosts = posts.filter((p) => p.authorId === id);

  return (
    <div className="py-4 max-w-3xl mx-auto space-y-4">
      {/* Cover + avatar */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-facebook-blue to-blue-400" />
        <div className="px-6 pb-6 relative">
          <div className="absolute -top-12 left-6 w-24 h-24 rounded-full bg-facebook-blue border-4 border-white flex items-center justify-center text-3xl font-bold text-white">
            {user.avatar}
          </div>
          <div className="pt-16">
            <h1 className="text-2xl font-bold text-facebook-text">{user.name}</h1>
            <p className="text-facebook-muted mt-1">{user.bio}</p>
            {user.location && (
              <p className="text-sm text-facebook-muted mt-2">📍 {user.location}</p>
            )}
            <div className="mt-4 flex gap-2">
              <button className="bg-facebook-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-facebook-dark">
                Ajouter ami
              </button>
              <button className="bg-gray-200 text-facebook-text px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300">
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-lg mb-4">Publications</h2>
        {userPosts.length === 0 ? (
          <p className="text-facebook-muted text-sm">Aucune publication pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <div key={post.id} className="border-b border-gray-100 pb-4 last:border-0">
                <p className="text-facebook-text">{post.content}</p>
                <p className="text-xs text-facebook-muted mt-2">
                  {post.timestamp} · 👍 {post.likes} · {post.comments} commentaires
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center">
        <Link href="/" className="text-facebook-blue hover:underline text-sm">
          ← Retour au fil d&apos;actualité
        </Link>
      </div>
    </div>
  );
      }
