import { auth, storedb } from "@/config/config";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { collection, addDoc, getDoc, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

// Password reset function
const forgetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.info("Password reset email sent. Please check your inbox.");
  } catch (err) {
    toast.error(err.message);
  }
};

// Signup function with email verification
const handleSignup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);

    const userRef = doc(storedb, `users`, user.uid);
    const userSnapshot = await getDoc(userRef);

    // Only set user data if it doesn't exist in Firestore
    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        email: user.email,
        uid: user.uid,
        name: user.displayName || "",  // Handling null values
        photoURL: user.photoURL || "",
        phoneNumber: user.phoneNumber || "",
        providerId: user.providerData[0]?.providerId || "firebase",
        role: "user",
        isOnline: true,  // Set initial online status to true
        createdAt: serverTimestamp(),  // Store when the user signed up
      });
    }

    // Add event listener to set the user offline on window close
    window.addEventListener("beforeunload", async () => {
      await updateDoc(userRef, {
        isOnline: false,
      });
    });

    toast.info("Email verification sent! Please check your inbox.");
  } catch (err) {
    toast.error(err.message);
  }
};

// Login function
const handleLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if the user's email is verified
    if (user.emailVerified) {
      // Update Firestore user doc to set online status
      const userRef = doc(storedb, `users`, user.uid);
      await updateDoc(userRef, {
        isOnline: true,  // Set online status to true
        lastLogin: serverTimestamp(),  // Update last login time
      });

      // Add event listener to set the user offline on window close
      window.addEventListener("beforeunload", async () => {
        await updateDoc(userRef, {
          isOnline: false,
        });
      });

      toast.success("Login successful!");
    } else {
      toast.info("Please verify your email.");
    }
  } catch (err) {
    toast.error(err.message);
  }
  return <></>;
};

// Logout function to track user offline status
const handleLogout = async () => {
  const user = auth.currentUser;
  if (user) {
    const userRef = doc(storedb, `users`, user.uid);
    try {
      await updateDoc(userRef, {
        isOnline: false, // Set user as offline
      });
      await signOut(auth);
      toast.success("Logged out successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  }
};

export { forgetPassword, handleSignup, handleLogin, handleLogout };
