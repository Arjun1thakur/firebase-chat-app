import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Chat from "@/components/Barpart/chat"
import Setting from "@/components/Barpart/setting"

const menuItems =[
    {
        id:1,
        icon:(<svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>),
        component: <Chat/>
    },
    {
        id:2,
        icon:(<svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>),
        component: <Setting/>
    },
]
const Sidebar = () => {
    const [activeIndex, setActiveIndex] = useState(1);
    const renderMenu = () => {
        return menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveIndex(item.id)}
            className={`p-1.5 transition-colors duration-200 rounded-lg ${
              activeIndex === item.id
                ? "text-blue-500 bg-blue-100 dark:text-blue-400 dark:bg-gray-800"
                : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
           {item.icon}
          </button>
        ));
      };
  return (
    <>
      <aside className="flex">
        <div className="flex flex-col items-center w-16 h-screen py-8 space-y-4 bg-white dark:bg-gray-900 dark:border-gray-700">
          <Link href="/">
            <Image
              width={200}
              height={200}
              className="w-auto h-12"
              src={"/svg/alpha.svg"}
              alt="logo"
            />
          </Link>


          {renderMenu()}
        </div>

        <div className="h-screen py-8 overflow-y-auto bg-white border-l border-r sm:w-80 w-60 dark:bg-gray-900 dark:border-gray-700">
            {menuItems.find((item) => item.id === activeIndex)?.component}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
