import { NextApiRequest, NextApiResponse } from "next";
const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_KEY.split("-")[1],
});

interface ErrorResponseInterface {
  error: string;
}

interface SuccessResponseInterface {
  message: string;
}

export default async (req: NextApiRequest, res: NextApiResponse<SuccessResponseInterface | ErrorResponseInterface>) => {
  const { email } = req.body;

  if (!email) return res.status(409).json({ error: "El email es requerido" });

  try {
    const response = await client.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
      email_address: email,
      status: "subscribed",
    });

    console.log(response);


  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() }); 
  }
};
