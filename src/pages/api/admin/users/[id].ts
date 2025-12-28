// src/pages/api/admin/users/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import  connectToDatabase  from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(user);
      } catch (error) {
        return res.status(500).json({ message: "Error fetching user", error });
      }

    case "PUT":
      try {
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ message: "User updated", user: updatedUser });
      } catch (error) {
        return res.status(400).json({ message: "Error updating user", error });
      }

    case "DELETE":
      try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ message: "User deleted" });
      } catch (error) {
        return res.status(500).json({ message: "Error deleting user", error });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
