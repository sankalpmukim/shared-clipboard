// Example of a restricted endpoint that only authenticated users can access from https://next-auth.js.org/getting-started/example

import { NextApiRequest, NextApiResponse } from "next";

import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { prisma } from "../../server/db/client";

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });
  if (!session || !session.user)
    return res.status(401).json({ error: "unauthorized" });

  //   switch case for CRUD methods
  switch (req.method) {
    case "GET":
      const clips = await prisma.clip.findMany({
        where: {
          userId: session.user.id,
        },
      });
      return res.status(200).json(clips);
    case "POST":
      const clip = await prisma.clip.create({
        data: {
          title: req.body.title,
          content: req.body.content,
          userId: session.user.id,
        },
      });
      return res.status(201).json(clip);
    case "PUT":
      const updatedClip = await prisma.clip.update({
        where: {
          id: req.body.id,
        },
        data: {
          title: req.body.title,
          content: req.body.content,
        },
      });
      return res.status(200).json(updatedClip);
    case "DELETE":
      const deletedClip = await prisma.clip.delete({
        where: {
          id: req.body.id,
        },
      });
      return res.status(200).json(deletedClip);
    default:
      //   default case for other methods
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default restricted;
