// W:\Amazone-clone2\my-app\src\pages\api\users\index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import  connectToDatabase  from "@/lib/mongodb";
import User from "@/models/User"; // ✅ Your User mongoose model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  switch (req.method) {
    case "GET": // 🔹 Fetch all users
      try {
        const users = await User.find({});
        return res.status(200).json(users);
      } catch (error) {
        return res.status(500).json({ message: "Error fetching users", error });
      }

    case "POST": // 🔹 Create new user
      try {
        const user = new User(req.body);
        await user.save();
        return res.status(201).json({ message: "User created", user });
      } catch (error) {
        return res.status(400).json({ message: "Error creating user", error });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
