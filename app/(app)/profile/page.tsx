"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useBackground, BackgroundType } from "@/contexts/BackgroundContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Group, updateUserProfile } from "@/lib/firestore";
import { uploadImage } from "@/lib/storage";
import { Camera, LogOut, Copy, Users, Heart, Palette } from "lucide-react";

const BG_OPTIONS: { id: BackgroundType; label: string; emoji: string; preview: string }[] = [
  {
    id: "none",
    label: "なし",
    emoji: "✕",
    preview: "bg-white",
  },
  {
    id: "balloons",
    label: "風船",
    emoji: "🎈",
    preview: "bg-gradient-to-b from-sky-100 to-omoide-warm",
  },
  {
    id: "sparkles",
    label: "キラキラ",
    emoji: "✨",
    preview: "bg-gradient-to-b from-omoide-warm to-emerald-50",
  },
  {
    id: "flowers",
    label: "花畑",
    emoji: "🌸",
    preview: "bg-gradient-to-b from-pink-50 to-omoide-warm",
  },
];

// Mini animated previews
function BalloonMini() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {["🎈","🎀","🎈"].map((e, i) => (
        <span key={i} className="absolute text-lg select-none"
          style={{
            left: `${20 + i * 28}%`, bottom: 0,
            animationName: "float-balloon",
            animationDuration: `${4 + i}s`,
            animationDelay: `${i * 0.8}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        >{e}</span>
      ))}
    </div>
  );
}

function SparklesMini() {
  const items = [
    { e: "✦", l: "15%", t: "20%", d: "0s", s: "0.8s" },
    { e: "★", l: "50%", t: "50%", d: "0.4s", s: "1s" },
    { e: "✧", l: "75%", t: "25%", d: "0.8s", s: "0.7s" },
    { e: "⋆", l: "35%", t: "70%", d: "0.2s", s: "1.2s" },
    { e: "✦", l: "80%", t: "65%", d: "0.6s", s: "0.9s" },
  ];
  return (
    <div className="absolute inset-0">
      {items.map((it, i) => (
        <span key={i} className="absolute text-omoide-coral font-bold select-none"
          style={{
            left: it.l, top: it.t, fontSize: 14,
            animationName: "sparkle-pop",
            animationDuration: it.s,
            animationDelay: it.d,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
          }}
        >{it.e}</span>
      ))}
    </div>
  );
}

function FlowersMini() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {["🌸","🌼","🌺","🌷"].map((e, i) => (
        <span key={i} className="absolute text-base select-none"
          style={{
            left: `${10 + i * 22}%`, top: "-10px",
            animationName: "petal-fall",
            animationDuration: `${3 + i * 0.5}s`,
            animationDelay: `${i * 0.6}s`,
            animationTimingFunction: "ease-in",
            animationIterationCount: "infinite",
          }}
        >{e}</span>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { user, profile, logout, refreshProfile } = useAuth();
  const { background, setBackground } = useBackground();
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, `avatars/${user.uid}`);
      await updateUserProfile(user.uid, { photoURL: url });
      await refreshProfile();
      toast.success("プロフィール写真を更新しました");
    } catch {
      toast.error("アップロードに失敗しました");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  useEffect(() => {
    if (!profile?.groupId) return;
    getDoc(doc(db, "groups", profile.groupId)).then((snap) => {
      if (snap.exists()) setGroup({ id: snap.id, ...snap.data() } as Group);
    });
  }, [profile?.groupId]);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  function copyInviteCode() {
    if (!group?.inviteCode) return;
    navigator.clipboard.writeText(group.inviteCode);
    toast.success("招待コードをコピーしました");
  }

  return (
    <div>
      <header className="sticky top-0 bg-omoide-warm/80 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="font-semibold text-omoide-text">プロフィール</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* User card */}
        <div className="bg-white rounded-2xl p-5 flex items-center gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="relative w-16 h-16 rounded-full flex-shrink-0 group"
          >
            {profile?.photoURL ? (
              <img
                src={profile.photoURL}
                alt=""
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-omoide-coral flex items-center justify-center text-white text-2xl font-bold">
                {profile?.displayName?.charAt(0) ?? "?"}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              {uploading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-5 h-5 text-white" />
              )}
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <div>
            <p className="font-bold text-lg text-omoide-text">{profile?.displayName}</p>
            <p className="text-sm text-omoide-muted">{user?.email}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-omoide-coral mt-0.5"
            >
              写真を変更
            </button>
          </div>
        </div>

        {/* Group card */}
        {group && (
          <div className="bg-white rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-omoide-coral fill-omoide-coral" />
              <h2 className="font-semibold text-omoide-text">{group.name}</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-omoide-muted">
              <Users className="w-4 h-4" />
              <span>メンバー {group.members.length}人</span>
            </div>
            <div className="bg-omoide-warm rounded-xl p-3">
              <p className="text-xs text-omoide-muted mb-1">招待コード</p>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xl tracking-widest text-omoide-text">
                  {group.inviteCode}
                </span>
                <button
                  onClick={copyInviteCode}
                  className="flex items-center gap-1 text-omoide-coral text-sm font-medium"
                >
                  <Copy className="w-4 h-4" />
                  コピー
                </button>
              </div>
              <p className="text-xs text-omoide-muted mt-1">
                このコードをパートナーや家族に共有してください
              </p>
            </div>
          </div>
        )}

        {/* Background picker */}
        <div className="bg-white rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-omoide-coral" />
            <h2 className="font-semibold text-omoide-text">背景テーマ</h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {BG_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setBackground(opt.id);
                  toast.success(`「${opt.label}」に変更しました`);
                }}
                className={`flex flex-col items-center gap-1.5 group`}
              >
                <div
                  className={`relative w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    background === opt.id
                      ? "border-omoide-coral shadow-md scale-105"
                      : "border-transparent hover:border-omoide-pink"
                  } ${opt.preview}`}
                >
                  {opt.id === "none" && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-2xl font-light">✕</div>
                  )}
                  {opt.id === "balloons"  && <BalloonMini />}
                  {opt.id === "sparkles"  && <SparklesMini />}
                  {opt.id === "flowers"   && <FlowersMini />}
                  {background === opt.id && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-omoide-coral rounded-full flex items-center justify-center">
                      <span className="text-white text-[9px] font-bold">✓</span>
                    </div>
                  )}
                </div>
                <span className={`text-xs font-medium ${background === opt.id ? "text-omoide-coral" : "text-omoide-muted"}`}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 text-red-400 hover:bg-red-50 transition"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">ログアウト</span>
        </button>
      </div>
    </div>
  );
}
