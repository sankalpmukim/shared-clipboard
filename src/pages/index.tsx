import AddClip from "../components/AddClip";
import Head from "next/head";
import type { NextPage } from "next";
import ViewClips from "../components/ViewClips";
import { signOut as logout } from "next-auth/react";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session } = useSession({ required: true });
  return (
    <>
      <Head>
        <title>{`Shared Clipboards`}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <button
          onClick={() => {
            logout();
          }}
        >{`logout`}</button>
        <div>
          {!session ? (
            <div>{`Logging you in momentarily...`}</div>
          ) : (
            <div>
              <ViewClips session={session} />
              <AddClip session={session} />
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
