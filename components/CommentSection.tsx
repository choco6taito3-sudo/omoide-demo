"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Comment, subscribeComments, addComment } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "@/lib/dateUtils";
import toast from "react-hot-toast";

type Props = { postId: string };

export default function CommentSection({ postId }: Props) {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeComments(postId, setComments);
    return unsubscribe;
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !profile || !text.trim()) return;
    setSubmitting(true);
    try {
      await addComment(postId, {
        authorId: user.uid,
        authorName: profile.displayName ?? user.displayName ?? "ユーザー",
        text: text.trim(),
      });
      setText("");
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      toast.error("コメントの送信に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col">
      {/* Comment list */}
      <div className="divide-y divide-gray-50">
        {comments.length === 0 ? (
          <p className="text-sm text-omoide-muted text-center py-6">
            最初のコメントを書いてみよう
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3 py-3">
              <div className="w-8 h-8 rounded-full bg-omoide-pink flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {c.authorName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-sm text-omoide-text">{c.authorName}</span>
                  <span className="text-xs text-omoide-muted">{formatDistanceToNow(c.createdAt)}</span>
                </div>
                <p className="text-sm text-omoide-text mt-0.5 break-words">{c.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-16 bg-white border-t border-gray-100 flex items-center gap-2 px-4 py-2"
      >
        <div className="w-8 h-8 rounded-full bg-omoide-pink flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          {profile?.displayName?.charAt(0) ?? "?"}
        </div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="コメントを追加..."
          className="flex-1 text-sm bg-transparent focus:outline-none"
        />
        <button
          type="submit"
          disabled={!text.trim() || submitting}
          className="text-omoide-coral disabled:opacity-30"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
