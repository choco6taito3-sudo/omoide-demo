import { Timestamp } from "firebase/firestore";

export function formatDistanceToNow(ts: Timestamp | null): string {
  if (!ts) return "";
  const now = Date.now();
  const date = ts.toDate().getTime();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "たった今";
  if (minutes < 60) return `${minutes}分前`;
  if (hours < 24) return `${hours}時間前`;
  if (days < 7) return `${days}日前`;
  return ts.toDate().toLocaleDateString("ja-JP", { month: "long", day: "numeric" });
}
