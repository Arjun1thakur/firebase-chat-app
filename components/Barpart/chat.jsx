import { auth, storedb } from "@/config/config";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Chat = () => {
  let [loading, setLoading] = useState(true);
  let [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchAllUsersExceptCurrent = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const usersRef = collection(storedb, "users"); // Reference to the 'users' collection
          const querySnapshot = await getDocs(usersRef); // Fetch all documents in the collection

          const usersData = querySnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((u) => u.id !== user.uid); // Filter out the current user

          setUsers(usersData); // Set the filtered data to state
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchAllUsersExceptCurrent();
  }, []);

  return (
    <>
      <h2 className="px-5 text-lg font-medium text-gray-800 dark:text-white">
        Accounts
      </h2>

      <div className="mt-8 space-y-4">
        {users &&
          users.map((item) => (
            <button key={item.uid} className="flex items-center w-full px-5 py-2 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
             <div className="w-14 h-14 relative">
             {item.photoURL ? ( <Image
                width={500}
                height={500}
                className="object-cover w-full h-full rounded-full"
                src={item.photoURL}
                alt={item.uid}
              />):(
                <Image
                width={500}
                height={500}
                  src="/images/face.jpg"
                  alt="User Avatar"
                  className="object-cover w-full h-full rounded-full"
                />
              )}
              
             </div>

              <div className="text-left rtl:text-right">
                <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">
                  {item.name && item.name}
                </h1>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.email && item.email}
                </p>
              </div>
              <div className={`w-3 h-3 float-right rounded-full ${item.isOnline ? "bg-green-400" : "bg-red-500"  }  top-0 right-1`}></div>
            </button>
          ))}
      </div>
    </>
  );
};

export default Chat;
