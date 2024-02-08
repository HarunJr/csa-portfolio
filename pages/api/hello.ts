// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';

// Define the path to your JSON file
const dataFilePath = path.join(process.cwd(), './assets/mintingPolicies.json');

export type MintData = {
  tokenName: string,
  policyId: string, // Moved policyId to be the second property
  mintingPolicy: string
  scriptAddress: string
};

const readDataFile = (): Record<string, MintData> => {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({}));
  }
  const fileData = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(fileData);
};

// Helper function to write data to the file
const writeDataFile = (data: Record<string, MintData>) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

export default function handler( req: NextApiRequest, res: NextApiResponse<MintData | { message: string }>) {
  // res.status(200).json({
  //   tokenName: 'John Doe',
  //   mintingPolicy: ''
  // })

  if (req.method === 'POST') {
    // Store a new minting policy
    const { tokenName, policyId, mintingPolicy, scriptAddress } = req.body as MintData;
    const data = readDataFile();
    
    data[tokenName] = { tokenName, policyId, mintingPolicy, scriptAddress }; // Store the entire Data object
    writeDataFile(data);
    res.status(200).json({ tokenName, policyId, mintingPolicy, scriptAddress });
  } else if (req.method === 'GET') {
      // Retrieve a minting policy
      const { tokenName } = req.query as { tokenName: string };
      const data = readDataFile();
      const policyData = data[tokenName];
      if (policyData) {
        console.log("dataFilePath: "+dataFilePath);
        console.log("Found policy data:", policyData);
        res.status(200).json(policyData);
      } else {
        console.log("Policy data not found for:", tokenName);
        res.status(404).json({ message: 'Minting policy not found' });
      }
  } else if (req.method === 'DELETE') {
      const { tokenName } = req.query as { tokenName: string };
      const data = readDataFile();

      if (data[tokenName]) {
          delete data[tokenName]; // Delete the entry
          writeDataFile(data); // Write the updated data back to the file
          res.status(200).json({ message: 'Minting policy deleted successfully' });
      } else {
          res.status(404).json({ message: 'Minting policy not found' });
      }

  }else {
    res.status(405).end(); // Method Not Allowed
  }

}

