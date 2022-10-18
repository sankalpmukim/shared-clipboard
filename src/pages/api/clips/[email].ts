// Example of a restricted endpoint that only authenticated users can access from https://next-auth.js.org/getting-started/example

import { NextApiRequest, NextApiResponse } from "next";

import { Clip } from "@prisma/client";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { prisma } from "../../../server/db/client";

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (!session || !session.user) {
    res.status(401).json({ error: "unauthorized" });
  }

  // get the email from the url
  const { email } = req.query;

  // get the user from the database
  const user = await prisma.user.findUnique({
    where: {
      email: email as string,
    },
  });

  // if the user doesn't exist, return an error
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // get the clips for the user
  const clips = await prisma.clip.findMany({
    where: {
      userId: user.id,
    },
  });

  const returnableClips: Clip[] = [];

  //   add the ones that are all allowed
  clips.forEach((clip) => {
    if (clip.allowAll) {
      returnableClips.push(clip);
    }
  });

  //   add the ones that are allowed for the user
  if (!!session && !!session.user) {
    clips.forEach((clip) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (clip.allowed.includes(session!.user!.email!)) {
        // if clip.id is not in returnableClips, add it
        if (!returnableClips.find((c) => c.id === clip.id)) {
          returnableClips.push(clip);
        }
        // console.log(`allowed`);
      } else {
        // console.log("not allowed", session?.user?.email, clip.allowed);
      }
    });
  }
  //   console.log(`object`, returnableClips, clips);
  return res.status(200).json(returnableClips);
};

export default restricted;
