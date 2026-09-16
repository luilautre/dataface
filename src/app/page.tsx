import Link from "next/link";
import { posts, users } from "@/lib/mockData";

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 py-4">
      {/* Left sidebar */}
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
            <li>
              <Link href="/profile/me" className="flex items-center gap-2 text-facebook-muted hover:text-facebook-blue">
                👤 Mon profil
              </Link>
            </li>
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-facebook-text mb-2">À propos</h2>
          <p className="text-sm text-facebook-muted">
            DataFace combine un feed style Facebook avec des bases de données type Excel. 
            Explorez la base publique, puis créez votre propre base liée.
          </p>
        </div>
      </aside>

      {/* Main feed */}
      <section className="lg:col-span-6 space-y-4">
        {/* Create post box */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
              U
            </div>
            <input
              type="text"
              placeholder="Quoi de neuf ?"
              className="flex-1 bg-facebook-gray rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-facebook-blue"
              readOnly
            />
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-gray-100 text-sm text-facebook-muted">
            <button className="flex-1 py-1.5 rounded-lg hover:bg-gray-100">📷 Photo</button>
            <button className="flex-1 py-1.5 rounded-lg hover:bg-gray-100">🎥 Vidéo</button>
            <button className="flex-1 py-1.5 rounded-lg hover:bg-gray-100">😊 Humeur</button>
          </div>
        </div>

        {/* Posts */}
        {posts.map((post) => {
          const author = users.find((u) => u.id === post.authorId) || users[0];
          return (
            <article key={post.id} className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <Link href={`/profile/${author.id}`}>
                    <div className="w-10 h-10 rounded-full bg-facebook-blue text-white flex items-center justify-center font-semibold">
                      {author.avatar}
                    </div>
                  </Link>
                  <div>
                    <Link href={`/profile/${author.id}`} className="font-semibold text-facebook-text hover:underline">
                      {author.name}
                    </Link>
                    <p className="text-xs text-facebook-muted">{post.timestamp}</p>
                  </div>
                </div>
                <p className="mt-3 text-facebook-text whitespace-pre-wrap">{post.content}</p>
              </div>
              <div className="px-4 py-2 border-t border-gray-100 flex justify-between text-sm text-facebook-muted">
                <span>👍 {post.likes}</span>
                <span>{post.comments} commentaires</span>
              </div>
              <div className="px-2 py-1 border-t border-gray-100 flex text-sm font-medium text-facebook-muted">
                <button className="flex-1 py-2 rounded-lg hover:bg-gray-100">👍 J&apos;aime</button>
                <button className="flex-1 py-2 rounded-lg hover:bg-gray-100">💬 Commenter</button>
                <button className="flex-1 py-2 rounded-lg hover:bg-gray-100">↗ Partager</button>
              </div>
            </article>
          );
        })}
      </section>

      {/* Right sidebar */}
      <aside className="hidden lg:block lg:col-span-3 space-y-3">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-facebook-text mb-3">Contacts</h2>
          <ul className="space-y-2">
            {users.filter((u) => u.id !== "me").map((u) => (
              <li key={u.id}>
                <Link href={`/profile/${u.id}`} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded">
                  <div className="w-8 h-8 rounded-full bg-facebook-blue text-white flex items-center justify-center text-sm font-semibold">
                    {u.avatar}
                  </div>
                  <span className="text-sm text-facebook-text">{u.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-facebook-light rounded-xl p-4 text-sm">
          <p className="font-medium text-facebook-blue mb-1">💡 Astuce</p>
          <p className="text-facebook-muted">
            Allez dans <Link href="/public-db" className="underline">Base publique</Link> pour voir le tableau type Excel, 
            puis créez votre version dans <Link href="/my-db" className="underline">Ma base</Link>.
          </p>
        </div>
      </aside>
    </div>
  );
}
