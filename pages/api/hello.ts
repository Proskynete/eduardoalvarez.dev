// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";

interface ResponseInterface {
  name: string;
}

export default (
  req: NextApiRequest,
  res: NextApiResponse<ResponseInterface>
) => {
  res.status(200).json({ name: "Eduardo Álvarez" });
};
