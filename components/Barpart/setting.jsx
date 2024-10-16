import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth, storedb } from "@/config/config";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
const Setting = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); // To toggle between edit mode
  const [updatedData, setUpdatedData] = useState({}); // Track changes
  const router = useRouter();
  const fileInputRef = useRef(null);

  const changeImage = () => {
    fileInputRef.current.click();
  };

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(storedb, "users", user.uid);
          const docSnap = await getDoc(userRef);
          console.log(docSnap.data());
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle logout
  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // Optionally redirect after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Submit updated user data
  // Function to handle the file input change and log the image file
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        saveImageToFirestore(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveImageToFirestore = async (base64String) => {
    try {
      const docRef = doc(storedb, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        photoURL: base64String,
      });
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image: ", error);
      toast.error("Failed to upload image.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="px-5 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white">
          Accounts Setting
        </h2>
      </div>

      {userData && (
        <div className="mt-8 space-y-4">
          <div className="px-5 py-2 flex flex-col gap-4 items-center">
            <div className="relative w-32 h-32">
              {userData.photoURL ? (
                <img
                  onClick={changeImage}
                  src={userData.photoURL}
                  alt="User Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <img
                  onClick={changeImage}
                  src="/images/face.jpg"
                  alt="User Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div onClick={changeImage} className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 rounded-full transition-opacity duration-300">
                <img  src="/svg/edit.svg" alt="Edit" className="w-4 h-4" />
              </div>
            </div>
            
          </div>
          <div className="px-5 py-2">
            <p>Info</p>
            <hr className="opacity-40 my-2" />
            <div className="flex w-full justify-between group">
                <p className="text-sm text-gray-400">Name : <span className="text-white">{userData.name && userData.name}</span></p>
                <div >
                <button className="group-hover:visible invisible text-sm">
                <img src="/svg/edit.svg" className="w-4 h-4" alt="edit" />
              </button>
              </div>
            </div>
            <div className="flex w-full justify-between group">
                <p className="text-sm text-gray-400">Email : <span className="text-white">{userData.email}</span></p>
                <div >
                <button className="group-hover:visible invisible text-sm">
                <img src="/svg/edit.svg" className="w-4 h-4" alt="edit" />
              </button>
              </div>
            </div>
            <div className="flex w-full justify-between group">
                <p className="text-sm text-gray-400">Phone No : <span className="text-white">{userData.phoneNumber}</span></p>
                <div >
                <button className="group-hover:visible invisible text-sm">
                <img src="/svg/edit.svg" className="w-4 h-4" alt="edit" />
              </button>
              </div>
            </div>
            <div className="flex w-full justify-between group">
                <p className="text-sm text-gray-400">About : <span className="text-white">{userData.about}</span></p>
                <div >
                <button className="group-hover:visible invisible text-sm">
                <img src="/svg/edit.svg" className="w-4 h-4" alt="edit" />
              </button>
              </div>
            </div>
            
              
        
          </div>

          <button
            className="flex items-center w-full px-5 py-2 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none"
            onClick={logout}
          >
            <img
              className="object-contain w-6 h-6"
              src="/svg/logout.svg"
              alt="Logout Icon"
            />
            <div className="text-left rtl:text-right">
              <h3 className="text-sm font-medium text-gray-700 capitalize dark:text-white">
                Logout
              </h3>
            </div>
          </button>
        </div>
      )}
    </>
  );
};

export default Setting;
