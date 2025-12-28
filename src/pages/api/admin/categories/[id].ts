// W:\Amazone-clone2\my-app\src\pages\api\admin\categories\[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    await client.connect();
    const db = client.db('My_ecommerce_website');
    const collection = db.collection('categories');

    if (req.method === 'GET') {
      const category = await collection.findOne({ _id: new ObjectId(id as string) });
      res.status(200).json(category);
    } else if (req.method === 'PUT') {
      const updatedCategory = req.body;
      const result = await collection.updateOne(
        { _id: new ObjectId(id as string) },
        { $set: updatedCategory }
      );
      res.status(200).json(result);
    } else if (req.method === 'DELETE') {
      const result = await collection.deleteOne({ _id: new ObjectId(id as string) });
      res.status(200).json(result);
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    await client.close();
  }
}
