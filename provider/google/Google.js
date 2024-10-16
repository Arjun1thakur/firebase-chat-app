import { auth, storedb } from '@/config/config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import io from 'socket.io-client';
import { toast } from 'sonner';

const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();

  try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(storedb, `users`, user.uid);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
          await setDoc(userRef, {
              email: user.email,
              uid: user.uid,
              name: user.displayName || "",
              photoURL: user.photoURL || "",
              phoneNumber: user.phoneNumber || "",
              providerId: user.providerData[0]?.providerId || "google",
              role: "user",
              isOnline: true,
              createdAt: serverTimestamp(),
          });
      } else {
          await updateDoc(userRef, {
              isOnline: true,
              lastLogin: serverTimestamp(),
          });
      }

      // Move socket initialization to a useEffect or context
      const socket = io(); // Ensure this works as expected
      socket.emit('registerUser', user.uid);

      window.addEventListener("beforeunload", async () => {
          await updateDoc(userRef, {
              isOnline: false,
          });
      });

      return toast.success(`${user.displayName || "User"} signed in successfully`);
  } catch (err) {
      return toast.error(err.message);
  }
};

export default handleGoogleSignIn