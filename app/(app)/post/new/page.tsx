"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createPost } from "@/lib/firestore";
import { uploadPostImages } from "@/lib/storage";
import { ImagePlus, X, ArrowLeft } from "lucide-react";

export default function NewPostPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    const newFiles = accepted.slice(0, 10 - files.length);
    setFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(f);
    });
  }, [files.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 10,
    disabled: files.length >= 10,
  });

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !profile?.groupId) return;
    if (files.length === 0) {
      toast.error("写真を選んでください");
      return;
    }
    setUploading(true);
    try {
      const postId = crypto.randomUUID();
      const imageUrls = await uploadPostImages(
        files,
        profile.groupId,
        postId,
        setProgress
      );
      await createPost({
        groupId: profile.groupId,
        authorId: user.uid,
        authorName: profile.displayName,
        imageUrls,
        caption,
      });
      toast.success("投稿しました！");
      router.push("/");
    } catch {
      toast.error("投稿に失敗しました");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 bg-omoide-warm/80 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-omoide-text" />
          </button>
          <h1 className="font-semibold text-omoide-text">新しい投稿</h1>
          <button
            onClick={handleSubmit}
            disabled={uploading || files.length === 0}
            className="text-omoide-coral font-semibold text-sm disabled:opacity-40"
          >
            {uploading ? "投稿中..." : "投稿する"}
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Image picker */}
        <div className="grid grid-cols-3 gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
              <Image src={src} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
          {files.length < 10 && (
            <div
              {...getRootProps()}
              className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition ${
                isDragActive
                  ? "border-omoide-coral bg-omoide-warm"
                  : "border-gray-200 hover:border-omoide-pink"
              }`}
            >
              <input {...getInputProps()} />
              <ImagePlus className="w-7 h-7 text-omoide-muted mb-1" />
              <span className="text-xs text-omoide-muted">写真を追加</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {uploading && (
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-omoide-coral h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Caption */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="一言コメントを追加（任意）"
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-omoide-coral"
        />

        <p className="text-xs text-omoide-muted text-center">
          写真は最大10枚まで追加できます（{files.length}/10）
        </p>
      </form>
    </div>
  );
}
