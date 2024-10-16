"use client";
import Login from "@/components/Login/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/config";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar"
export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if the provider is password-based and email is verified
        const providerId = user.providerData[0]?.providerId;
        if (providerId === "password" && user.emailVerified) {
          setIsLogin(true);
        } else if (providerId !== "password") {
          setIsLogin(true);
        } else {
          setIsLogin(false); 
        }
      } else {
        setIsLogin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      {!isLogin ? (
        <Login />
      ) : (
        <div>
         <Sidebar/>
        </div>
      )}
    </div>
  );
}
