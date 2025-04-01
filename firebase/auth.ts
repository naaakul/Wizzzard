import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth } from "./config";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const db = getFirestore();

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const isUsernameAvailable = async (
  username: string
): Promise<boolean> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    return querySnapshot.empty;
  } catch (error) {
    console.error("Error checking username availability:", error);
    throw error;
  }
};

export const saveUserData = async (user: User, username: string) => {
  try {
    const isAvailable = await isUsernameAvailable(username);
    if (!isAvailable) {
      throw new Error("Username is already taken");
    }

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      username: username,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAnonymous: user.isAnonymous,
      createdAt: new Date().toISOString(),
    });

    await updateProfile(user, {
      displayName: username,
    });

    return user;
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
};

export const getUserData = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    const userDoc = await getDoc(doc(db, "users", result.user.uid));

    return {
      user: result.user,
      isNewUser: !userDoc.exists(),
    };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);

    const userDoc = await getDoc(doc(db, "users", result.user.uid));

    return {
      user: result.user,
      isNewUser: !userDoc.exists(),
    };
  } catch (error) {
    console.error("Error signing in with GitHub:", error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    return {
      user: userCredential.user,
      isNewUser: true,
    };
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return {
      user: userCredential.user,
      isNewUser: false,
    };
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const signInAsGuest = async (username: string) => {
  try {
    const isAvailable = await isUsernameAvailable(username);
    if (!isAvailable) {
      throw new Error("Username is already taken");
    }

    const userCredential = await signInAnonymously(auth);

    await saveUserData(userCredential.user, username);

    return {
      user: userCredential.user,
      isNewUser: false,
    };
  } catch (error) {
    console.error("Error signing in as guest:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);

      if (authUser) {
        try {
          const data = await getUserData(authUser.uid);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, userData, loading };
};

export const useRequireAuth = (redirectUrl = "/auth/signin") => {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectUrl);
    }
  }, [user, loading, router, redirectUrl]);

  return { user, userData, loading };
};

export const isGuestUser = (user: User | null) => {
  return user?.isAnonymous || false;
};

export const hasCompletedRegistration = async (
  user: User
): Promise<boolean> => {
  if (!user) return false;

  try {
    const userData = await getUserData(user.uid);
    return !!userData && !!userData.username;
  } catch (error) {
    console.error("Error checking registration status:", error);
    return false;
  }
};
