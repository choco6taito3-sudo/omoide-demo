import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadImage(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const storageRef = ref(storage, path);
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);
    task.on(
      "state_changed",
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(pct);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

export async function uploadPostImages(
  files: File[],
  groupId: string,
  postId: string,
  onProgress?: (overall: number) => void
): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = `groups/${groupId}/${postId}/${Date.now()}_${file.name}`;
    const url = await uploadImage(file, path, (pct) => {
      const overall = ((i + pct / 100) / files.length) * 100;
      onProgress?.(overall);
    });
    urls.push(url);
  }
  return urls;
}
