"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, PlusSquare, Home, User, PlusCircle, ArrowLeft, Send, ImagePlus, Copy, Users } from "lucide-react";
import { BackgroundProvider, useBackground, BackgroundType } from "@/contexts/BackgroundContext";
import BackgroundLayer from "@/components/BackgroundLayer";

const MOCK_POSTS = [
  {
    id: "1",
    authorName: "はなこ",
    createdAt: "2時間前",
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
    caption: "今日のお散歩☀️ 天気が最高だった！",
    likesCount: 5,
    commentsCount: 2,
    liked: true,
  },
  {
    id: "2",
    authorName: "たろう",
    createdAt: "昨日",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    caption: "記念日ディナー🍷 ありがとう",
    likesCount: 8,
    commentsCount: 3,
    liked: false,
  },
];

const MOCK_COMMENTS = [
  { id: "1", name: "たろう", text: "すごくきれいだね！❤️", time: "1時間前" },
  { id: "2", name: "はなこ", text: "また行こうね〜", time: "30分前" },
];

type Screen = "timeline" | "post-new" | "post-detail" | "profile";

const BG_OPTS: { id: BackgroundType; label: string }[] = [
  { id: "none",     label: "なし" },
  { id: "balloons", label: "🎈風船" },
  { id: "sparkles", label: "✨キラキラ" },
  { id: "flowers",  label: "🌸花畑" },
];

function PreviewInner() {
  const [screen, setScreen] = useState<Screen>("timeline");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set(["1"]));
  const [comment, setComment] = useState("");
  const { background, setBackground } = useBackground();

  function toggleLike(id: string) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen relative bg-omoide-warm overflow-hidden">
      <BackgroundLayer />
      {/* BG switcher */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex gap-1 bg-white/90 backdrop-blur rounded-full shadow px-2 py-1" style={{maxWidth:340}}>
        {BG_OPTS.map((o) => (
          <button key={o.id} onClick={() => setBackground(o.id)}
            className={`px-2 py-0.5 rounded-full text-[10px] transition ${background === o.id ? "bg-omoide-coral text-white" : "text-omoide-muted"}`}>
            {o.label}
          </button>
        ))}
      </div>
      {/* Screen switcher */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 flex gap-1 bg-white/90 backdrop-blur rounded-full shadow px-2 py-1 mt-2 text-[10px]" style={{maxWidth: 340, top: "2px"}}>
        {(["timeline","post-new","post-detail","profile"] as Screen[]).map((s) => (
          <button
            key={s}
            onClick={() => setScreen(s)}
            className={`px-2 py-0.5 rounded-full transition ${screen === s ? "bg-omoide-coral text-white" : "text-omoide-muted"}`}
          >
            {s === "timeline" ? "タイムライン" : s === "post-new" ? "投稿" : s === "post-detail" ? "詳細" : "プロフ"}
          </button>
        ))}
      </div>

      <div className="pt-10 pb-20">

        {/* ── TIMELINE ── */}
        {screen === "timeline" && (
          <div>
            <header className="sticky top-10 bg-omoide-warm/80 backdrop-blur-sm border-b border-gray-100 z-10">
              <div className="flex items-center justify-between px-4 h-14">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-omoide-coral fill-omoide-coral" />
                  <h1 className="font-bold text-lg text-omoide-text">Omoide</h1>
                </div>
                <PlusCircle className="w-6 h-6 text-omoide-coral" />
              </div>
            </header>
            <div className="p-4 space-y-4">
              {MOCK_POSTS.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-9 h-9 rounded-full bg-omoide-pink flex items-center justify-center text-white font-semibold text-sm">
                      {post.authorName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-omoide-text">{post.authorName}</p>
                      <p className="text-xs text-omoide-muted">{post.createdAt}</p>
                    </div>
                  </div>
                  <div className="relative aspect-square bg-gray-100">
                    <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="px-4 pt-3 pb-1 flex items-center gap-4">
                    <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1.5">
                      <Heart className={`w-6 h-6 ${likedIds.has(post.id) ? "fill-omoide-coral text-omoide-coral" : "text-omoide-muted"}`} />
                      <span className={`text-sm font-medium ${likedIds.has(post.id) ? "text-omoide-coral" : "text-omoide-muted"}`}>
                        {post.likesCount + (likedIds.has(post.id) !== post.liked ? (likedIds.has(post.id) ? 1 : -1) : 0)}
                      </span>
                    </button>
                    <button onClick={() => setScreen("post-detail")} className="flex items-center gap-1.5">
                      <MessageCircle className="w-6 h-6 text-omoide-muted" />
                      <span className="text-sm font-medium text-omoide-muted">{post.commentsCount}</span>
                    </button>
                  </div>
                  <div className="px-4 pb-3 pt-1">
                    <p className="text-sm text-omoide-text">
                      <span className="font-semibold mr-1">{post.authorName}</span>
                      {post.caption}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ── POST NEW ── */}
        {screen === "post-new" && (
          <div>
            <header className="sticky top-10 bg-omoide-warm/80 backdrop-blur-sm border-b border-gray-100 z-10">
              <div className="flex items-center justify-between px-4 h-14">
                <button onClick={() => setScreen("timeline")} className="p-2 -ml-2">
                  <ArrowLeft className="w-5 h-5 text-omoide-text" />
                </button>
                <h1 className="font-semibold text-omoide-text">新しい投稿</h1>
                <button className="text-omoide-coral font-semibold text-sm">投稿する</button>
              </div>
            </header>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&q=80" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=80" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
                  <ImagePlus className="w-7 h-7 text-omoide-muted mb-1" />
                  <span className="text-xs text-omoide-muted">写真を追加</span>
                </div>
              </div>
              <textarea
                defaultValue="今日のデート☀️ 最高の一日だった！"
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-omoide-coral"
              />
              <p className="text-xs text-omoide-muted text-center">写真は最大10枚まで追加できます（2/10）</p>
            </div>
          </div>
        )}

        {/* ── POST DETAIL ── */}
        {screen === "post-detail" && (
          <div>
            <header className="sticky top-10 bg-omoide-warm/80 backdrop-blur-sm border-b border-gray-100 z-10">
              <div className="flex items-center gap-3 px-4 h-14">
                <button onClick={() => setScreen("timeline")} className="p-2 -ml-2">
                  <ArrowLeft className="w-5 h-5 text-omoide-text" />
                </button>
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-8 h-8 rounded-full bg-omoide-pink flex items-center justify-center text-white text-sm font-semibold">は</div>
                  <div>
                    <p className="text-sm font-semibold text-omoide-text leading-tight">はなこ</p>
                    <p className="text-xs text-omoide-muted">2時間前</p>
                  </div>
                </div>
              </div>
            </header>
            <div className="relative aspect-square bg-gray-100">
              <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="bg-white px-4 pt-3 pb-2 flex items-center gap-4">
              <button className="flex items-center gap-1.5">
                <Heart className="w-6 h-6 fill-omoide-coral text-omoide-coral" />
                <span className="text-sm font-medium text-omoide-coral">5</span>
              </button>
            </div>
            <div className="bg-white px-4 pb-3">
              <p className="text-sm text-omoide-text"><span className="font-semibold mr-1">はなこ</span>今日のお散歩☀️ 天気が最高だった！</p>
            </div>
            <div className="bg-white border-t border-gray-50 px-4 pt-2">
              <h2 className="text-sm font-semibold text-omoide-text mb-2">コメント</h2>
              <div className="divide-y divide-gray-50">
                {MOCK_COMMENTS.map((c) => (
                  <div key={c.id} className="flex gap-3 py-3">
                    <div className="w-8 h-8 rounded-full bg-omoide-pink flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm text-omoide-text">{c.name}</span>
                        <span className="text-xs text-omoide-muted">{c.time}</span>
                      </div>
                      <p className="text-sm text-omoide-text mt-0.5">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-gray-100 py-2 mt-1">
                <div className="w-8 h-8 rounded-full bg-omoide-pink flex items-center justify-center text-white text-xs font-semibold">た</div>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="コメントを追加..."
                  className="flex-1 text-sm bg-transparent focus:outline-none"
                />
                <button className={`text-omoide-coral ${!comment.trim() ? "opacity-30" : ""}`}>
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PROFILE ── */}
        {screen === "profile" && (
          <div>
            <header className="sticky top-10 bg-omoide-warm/80 backdrop-blur-sm border-b border-gray-100 z-10">
              <div className="flex items-center justify-between px-4 h-14">
                <h1 className="font-semibold text-omoide-text">プロフィール</h1>
              </div>
            </header>
            <div className="p-4 space-y-4">
              <div className="bg-white rounded-2xl p-5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-omoide-coral flex items-center justify-center text-white text-2xl font-bold">た</div>
                <div>
                  <p className="font-bold text-lg text-omoide-text">たろう</p>
                  <p className="text-sm text-omoide-muted">taro@example.com</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-omoide-coral fill-omoide-coral" />
                  <h2 className="font-semibold text-omoide-text">たろうとはなこ</h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-omoide-muted">
                  <Users className="w-4 h-4" />
                  <span>メンバー 2人</span>
                </div>
                <div className="bg-omoide-warm rounded-xl p-3">
                  <p className="text-xs text-omoide-muted mb-1">招待コード</p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xl tracking-widest text-omoide-text">XK7F2A</span>
                    <button className="flex items-center gap-1 text-omoide-coral text-sm font-medium">
                      <Copy className="w-4 h-4" />コピー
                    </button>
                  </div>
                  <p className="text-xs text-omoide-muted mt-1">このコードをパートナーや家族に共有してください</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-100 z-40">
        <div className="flex items-center justify-around h-16">
          {[
            { s: "timeline" as Screen, Icon: Home, label: "ホーム" },
            { s: "post-new" as Screen, Icon: PlusSquare, label: "投稿" },
            { s: "profile" as Screen, Icon: User, label: "プロフィール" },
          ].map(({ s, Icon, label }) => (
            <button key={s} onClick={() => setScreen(s)}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 transition ${screen === s ? "text-omoide-coral" : "text-omoide-muted"}`}
            >
              <Icon className="w-6 h-6" strokeWidth={screen === s ? 2.5 : 1.8} />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <BackgroundProvider>
      <PreviewInner />
    </BackgroundProvider>
  );
}
