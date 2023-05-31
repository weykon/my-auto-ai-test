import path from 'path';
import { promises as fs } from 'fs';
import { NextApiResponse } from 'next';

export default async function handler(req: any, res: NextApiResponse) {
  const jsonDirectory = path.join(process.cwd(), 'json');
  const fileName = req.query.fileName;
  if (!fileName) {
    res.status(400).end('No file name provided in query');
    return;
  }
  if(fileName.includes('..')) {
    res.status(400).end('Invalid file name');
    return;
  }
  const fileContents = await fs.readFile(jsonDirectory + '/' + fileName, 'utf8');
  res.status(200).end(fileContents);
}