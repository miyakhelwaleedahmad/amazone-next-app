import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await client.connect();
    const db = client.db('My_ecommerce_website');
    const collection = db.collection('categories');

    if (req.method === 'GET') {
      const categories = await collection.find({}).toArray();
      return res.status(200).json(categories);
    }

    if (req.method === 'POST') {
      const { name, description } = req.body;
      if (!name) return res.status(400).json({ message: 'Name is required' });

      const slug = name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      const newCategory = { name, slug, description, isActive: true };
      const result = await collection.insertOne(newCategory);
      return res.status(201).json(result);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    await client.close();
  }
}
