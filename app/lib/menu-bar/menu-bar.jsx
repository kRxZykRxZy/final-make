"use client"; // use client so that we can use React hooks

import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, query, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MenuBar() {
  const [menus, setMenus] = useState([]);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user data from Firestore
  useEffect(() => {
    if (!user) {
      setUserData(null);
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  // Set menu links
  useEffect(() => {
    const baseMenus = [
      { id: 1, name: "Home", link: "/" },
      { id: 2, name: "Create", link: "/projects/create" },
    ];

    if (user) {
      baseMenus.push({ id: 3, name: "Dashboard", link: "/dashboard" });
    } else {
      baseMenus.push({ id: 3, name: "Login", link: "/login" });
      baseMenus.push({ id: 4, name: "Sign Up", link: "/signup" });
    }

    setMenus(baseMenus);
  }, [user]);

  return (
    <nav className="w-full border-b bg-white px-4 py-2 flex justify-between items-center relative">
      <Link href="/" className="text-xl font-bold">
        CodeBuild
      </Link>

      <div className="flex items-center space-x-4">
        {menus.map((menu) => (
          <Link
            key={menu.id}
            href={menu.link}
            className="text-gray-700 hover:text-gray-900"
          >
            {menu.name}
          </Link>
        ))}

        {user && userData && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <img
                src={`data:image/png;base64,${userData.profile_picture}`}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-700 hover:text-gray-900">
                {userData.username}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg py-2">
                <Link
                  href={`/users/${userData.username}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <Link 
                    href="/dashboard"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                >
                  My Stuff
                </Link>
                <Link 
                    href="/projects/create"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                >
                  Create
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                >
                  Settings
                </Link>

                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={async () => {
                    await auth.signOut();
                    setDropdownOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
