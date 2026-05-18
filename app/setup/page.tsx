"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createGroup, joinGroup } from "@/lib/firestore";
import { Heart, Users } from "lucide-react";

export default function SetupPage() {
  const { user, refreshProfile } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"create" | "join">("create");
  const [groupName, setGroupName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await createGroup(groupName, user.uid);
      await refreshProfile();
      toast.success("グループを作成しました！");
      router.push("/");
    } catch {
      toast.error("グループの作成に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const groupId = await joinGroup(inviteCode, user.uid);
      if (!groupId) {
        toast.error("招待コードが見つかりません");
        return;
      }
      await refreshProfile();
      toast.success("グループに参加しました！");
      router.push("/");
    } catch {
      toast.error("参加に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-omoide-coral rounded-full mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-omoide-text">グループ設定</h1>
          <p className="text-omoide-muted mt-1 text-sm">
            パートナーや家族と一緒に使うグループを作りましょう
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setTab("create")}
              className={`flex-1 py-3 text-sm font-medium transition ${
                tab === "create"
                  ? "text-omoide-coral border-b-2 border-omoide-coral"
                  : "text-omoide-muted"
              }`}
            >
              新しく作る
            </button>
            <button
              onClick={() => setTab("join")}
              className={`flex-1 py-3 text-sm font-medium transition ${
                tab === "join"
                  ? "text-omoide-coral border-b-2 border-omoide-coral"
                  : "text-omoide-muted"
              }`}
            >
              招待コードで参加
            </button>
          </div>

          <div className="p-6">
            {tab === "create" ? (
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-omoide-text mb-1">
                    グループ名
                  </label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-omoide-coral"
                    placeholder="たろうとはなこ"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-omoide-coral text-white rounded-xl py-2.5 font-medium hover:bg-[#4B8060] transition disabled:opacity-50"
                >
                  {loading ? "作成中..." : "グループを作成"}
                </button>
                <p className="text-xs text-omoide-muted text-center">
                  作成後に招待コードをパートナーに共有してください
                </p>
              </form>
            ) : (
              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-omoide-text mb-1">
                    招待コード
                  </label>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    required
                    maxLength={6}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-omoide-coral uppercase"
                    placeholder="ABC123"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-omoide-coral text-white rounded-xl py-2.5 font-medium hover:bg-[#4B8060] transition disabled:opacity-50"
                >
                  {loading ? "参加中..." : "グループに参加"}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-omoide-muted mt-4">
          <Heart className="w-3 h-3 inline-block fill-omoide-pink text-omoide-pink mr-1" />
          大切な人とだけ繋がる、安心・安全な空間
        </p>
      </div>
    </div>
  );
}
