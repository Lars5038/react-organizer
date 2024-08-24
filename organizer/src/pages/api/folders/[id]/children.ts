import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid folder ID' });
    return;
  }

  try {

    res.status(200).json({children: []});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching child folders' });
  } finally {
  }
}
