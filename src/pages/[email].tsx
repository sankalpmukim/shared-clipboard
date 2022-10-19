import { signIn, signOut } from "next-auth/react";

import ViewSharedClips from "../components/ViewSharedClips";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();
  const {
    query: { email },
  } = useRouter();

  if (typeof email !== "string") {
    return <div>{`Invalid email`}</div>;
  }

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>{`View shared clips`}</h1>

      <button
        onClick={() => {
          if (session) {
            signOut({
              redirect: false,
            });
          } else {
            signIn("google");
          }
        }}
      >{`Sign ${session ? `out` : `in`}`}</button>

      <ViewSharedClips session={session} email={email} />
    </>
  );
}
