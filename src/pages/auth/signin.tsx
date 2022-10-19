import { signIn, useSession } from "next-auth/react";

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Signin() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("No JWT");
      console.log(status);
      void signIn("google");
    } else if (status === "authenticated") {
      if (typeof router.query.callbackUrl === "string") {
        void router.push(router.query.callbackUrl);
      } else {
        void router.push("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return <div></div>;
}
