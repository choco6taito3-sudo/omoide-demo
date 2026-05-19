"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { getPost, toggleLike, Post } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
import CommentSection from "@/components/CommentSection";
import { formatDistanceToNow } from "@/lib/dateUtils";

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { user } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    getPost(id).then(setPost);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-omoide-coral border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const liked = user ? post.likedBy.includes(user.uid) : false;

  async function handleLike() {
    if (!user || !post) return;
    await toggleLike(post.id, user.uid, liked);
    setPost((p) =>
      p
        ? {
            ...p,
            likedBy: liked ? p.likedBy.filter((u) => u !== user.uid) : [...p.likedBy, user.uid],
            likesCount: liked ? p.likesCount - 1 : p.likesCount + 1,
          }
        : null
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 bg-omoide-warm/80 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-omoide-text" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-full bg-omoide-pink flex items-center justify-center text-white text-sm font-semibold">
              {post.authorName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-omoide-text leading-tight">{post.authorName}</p>
              <p className="text-xs text-omoide-muted">{formatDistanceToNow(post.createdAt)}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Image */}
      {post.imageUrls.length > 0 && (
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={post.imageUrls[imgIndex]}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
          />
          {post.imageUrls.length > 1 && (
            <>
              {imgIndex > 0 && (
                <button
                  onClick={() => setImgIndex((i) => i - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 rounded-full p-1"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
              )}
              {imgIndex < post.imageUrls.length - 1 && (
                <button
                  onClick={() => setImgIndex((i) => i + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 rounded-full p-1"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="bg-white px-4 pt-3 pb-2 flex items-center gap-4">
        <button onClick={handleLike} className="flex items-center gap-1.5">
          <Heart
            className={`w-6 h-6 transition-transform active:scale-125 ${
              liked ? "fill-omoide-coral text-omoide-coral" : "text-omoide-muted"
            }`}
          />
          <span className={`text-sm font-medium ${liked ? "text-omoide-coral" : "text-omoide-muted"}`}>
            {post.likesCount}
          </span>
        </button>
      </div>

      {post.caption && (
        <div className="bg-white px-4 pb-3">
          <p className="text-sm text-omoide-text">
            <span className="font-semibold mr-1">{post.authorName}</span>
            {post.caption}
          </p>
        </div>
      )}

      {/* Comments */}
      <div className="bg-white border-t border-gray-50 px-4 pt-2">
        <h2 className="text-sm font-semibold text-omoide-text mb-2">コメント</h2>
        <CommentSection postId={post.id} />
      </div>
    </div>
  );
}
