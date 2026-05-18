import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  Timestamp,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

export type UserProfile = {
  uid: string;
  displayName: string;
  photoURL: string | null;
  groupId: string | null;
  createdAt: Timestamp;
};

export type Group = {
  id: string;
  name: string;
  members: string[];
  inviteCode: string;
  createdBy: string;
  createdAt: Timestamp;
};

export type Post = {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  imageUrls: string[];
  caption: string;
  likesCount: number;
  likedBy: string[];
  commentsCount: number;
  createdAt: Timestamp;
};

export type Comment = {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: Timestamp;
};

export async function createUserProfile(
  uid: string,
  data: Omit<UserProfile, "uid" | "createdAt" | "groupId">
) {
  await setDoc(doc(db, "users", uid), {
    uid,
    ...data,
    groupId: null,
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function createGroup(name: string, creatorUid: string): Promise<string> {
  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const groupRef = doc(collection(db, "groups"));
  await setDoc(groupRef, {
    name,
    members: [creatorUid],
    inviteCode,
    createdBy: creatorUid,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "users", creatorUid), { groupId: groupRef.id });
  return groupRef.id;
}

export async function joinGroup(inviteCode: string, uid: string): Promise<string | null> {
  const q = query(collection(db, "groups"), where("inviteCode", "==", inviteCode.toUpperCase()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const groupDoc = snap.docs[0];
  await updateDoc(groupDoc.ref, { members: arrayUnion(uid) });
  await updateDoc(doc(db, "users", uid), { groupId: groupDoc.id });
  return groupDoc.id;
}

export async function createPost(data: {
  groupId: string;
  authorId: string;
  authorName: string;
  imageUrls: string[];
  caption: string;
}): Promise<string> {
  const ref = await addDoc(collection(db, "posts"), {
    ...data,
    likesCount: 0,
    likedBy: [],
    commentsCount: 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export function subscribePosts(
  groupId: string,
  callback: (posts: Post[]) => void
): () => void {
  const q = query(
    collection(db, "posts"),
    where("groupId", "==", groupId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap: QuerySnapshot<DocumentData>) => {
    const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
    callback(posts);
  });
}

export async function toggleLike(postId: string, uid: string, liked: boolean) {
  await updateDoc(doc(db, "posts", postId), {
    likedBy: liked ? arrayRemove(uid) : arrayUnion(uid),
    likesCount: increment(liked ? -1 : 1),
  });
}

export async function addComment(
  postId: string,
  data: { authorId: string; authorName: string; text: string }
) {
  await addDoc(collection(db, "posts", postId, "comments"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "posts", postId), { commentsCount: increment(1) });
}

export function subscribeComments(
  postId: string,
  callback: (comments: Comment[]) => void
): () => void {
  const q = query(
    collection(db, "posts", postId, "comments"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    const comments = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Comment));
    callback(comments);
  });
}

export async function getPost(postId: string): Promise<Post | null> {
  const snap = await getDoc(doc(db, "posts", postId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Post) : null;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, "displayName" | "photoURL">>
): Promise<void> {
  await updateDoc(doc(db, "users", uid), data);
}
