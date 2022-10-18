import ViewSharedClips from "../components/ViewSharedClips";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession({ required: true });
  const {
    query: { email },
  } = useRouter();

  if (typeof email !== "string") {
    return <div>{`Invalid email`}</div>;
  }

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status !== "authenticated") {
    return <p>Access Denied</p>;
  }

  return (
    <>
      <h1>{`View shared clips`}</h1>
      <ViewSharedClips session={session} email={email} />
    </>
  );
}
