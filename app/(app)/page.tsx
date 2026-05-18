"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { subscribePosts, Post } from "@/lib/firestore";
import PostCard from "@/components/PostCard";
import { Heart, PlusCircle } from "lucide-react";

export default function HomePage() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.groupId) return;
    const unsubscribe = subscribePosts(profile.groupId, (newPosts) => {
      setPosts(newPosts);
      setLoading(false);
    });
    return unsubscribe;
  }, [profile?.groupId]);

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 bg-omoide-warm/80 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-omoide-coral fill-omoide-coral" />
            <h1 className="font-bold text-lg text-omoide-text">Omoide</h1>
          </div>
          <Link href="/post/new">
            <PlusCircle className="w-6 h-6 text-omoide-coral" />
          </Link>
        </div>
      </header>

      {/* Feed */}
      <main className="p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center pt-16">
            <div className="w-8 h-8 border-2 border-omoide-coral border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <EmptyState />
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center pt-24 text-center px-8">
      <div className="w-20 h-20 bg-omoide-warm rounded-full flex items-center justify-center mb-4">
        <Heart className="w-10 h-10 text-omoide-pink fill-omoide-pink" />
      </div>
      <h2 className="text-lg font-semibold text-omoide-text mb-2">最初の思い出を投稿しよう</h2>
      <p className="text-sm text-omoide-muted mb-6">
        大切な人と写真を共有して、ふたりだけの思い出アルバムを作りましょう
      </p>
      <Link
        href="/post/new"
        className="bg-omoide-coral text-white rounded-full px-6 py-2.5 font-medium text-sm hover:bg-[#4B8060] transition"
      >
        写真を投稿する
      </Link>
    </div>
  );
}
