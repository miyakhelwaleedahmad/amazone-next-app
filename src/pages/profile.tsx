// W:\Amazone-clone2\my-app\src\pages\profile.tsx
import React, { useState } from "react";
import type { UserInfo } from "@/types";

export default function ProfilePage() {
  // local state with your type
  const [user, setUser] = useState<UserInfo>({
    name: "John Doe",
    email: "john@example.com",
    image: "/default-avatar.png",
  });

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <div className="flex items-center gap-4">
        <img
          src={user.image}
          alt={user.name}
          className="w-16 h-16 rounded-full border"
        />
        <div>
          <p className="text-lg font-medium">{user.name}</p>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <button
        onClick={() =>
          setUser({ ...user, name: "Miyakhel", email: "miyakhel@example.com" })
        }
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Update User
      </button>
    </div>
  );
}
