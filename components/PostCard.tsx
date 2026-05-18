"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Post, toggleLike } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "@/lib/dateUtils";

type Props = { post: Post };

export default function PostCard({ post }: Props) {
  const { user } = useAuth();
  const [imgIndex, setImgIndex] = useState(0);
  const liked = user ? post.likedBy.includes(user.uid) : false;
  const lastTap = useRef(0);

  async function handleLike() {
    if (!user) return;
    await toggleLike(post.id, user.uid, liked);
  }

  function handleDoubleTap() {
    const now = Date.now();
    if (now - lastTap.current < 300 && !liked) {
      handleLike();
    }
    lastTap.current = now;
  }

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-9 h-9 rounded-full bg-omoide-pink flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {post.authorName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-omoide-text truncate">{post.authorName}</p>
          <p className="text-xs text-omoide-muted">{formatDistanceToNow(post.createdAt)}</p>
        </div>
      </div>

      {/* Images carousel */}
      {post.imageUrls.length > 0 && (
        <div className="relative aspect-square bg-gray-100" onClick={handleDoubleTap}>
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
                  onClick={(e) => { e.stopPropagation(); setImgIndex((i) => i - 1); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 rounded-full p-1"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
              )}
              {imgIndex < post.imageUrls.length - 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setImgIndex((i) => i + 1); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 rounded-full p-1"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              )}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {post.imageUrls.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all ${
                      i === imgIndex ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 pt-3 pb-1 flex items-center gap-4">
        <button
          onClick={handleLike}
          className="flex items-center gap-1.5 group"
        >
          <Heart
            className={`w-6 h-6 transition-transform group-active:scale-125 ${
              liked ? "fill-omoide-coral text-omoide-coral" : "text-omoide-muted"
            }`}
          />
          <span className={`text-sm font-medium ${liked ? "text-omoide-coral" : "text-omoide-muted"}`}>
            {post.likesCount}
          </span>
        </button>
        <Link href={`/post/${post.id}`} className="flex items-center gap-1.5">
          <MessageCircle className="w-6 h-6 text-omoide-muted" />
          <span className="text-sm font-medium text-omoide-muted">{post.commentsCount}</span>
        </Link>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-4 pb-3 pt-1">
          <p className="text-sm text-omoide-text">
            <span className="font-semibold mr-1">{post.authorName}</span>
            {post.caption}
          </p>
        </div>
      )}

      {/* Comment link */}
      {post.commentsCount > 0 && (
        <Link href={`/post/${post.id}`} className="block px-4 pb-3">
          <p className="text-sm text-omoide-muted">
            コメントを{post.commentsCount}件見る
          </p>
        </Link>
      )}
    </article>
  );
}
