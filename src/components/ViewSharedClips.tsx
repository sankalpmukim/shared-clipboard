import { useCallback, useEffect, useState } from "react";

import { Clip } from "@prisma/client";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
  email: string;
}
const ViewSharedClips = ({ email }: Props) => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchClips = useCallback(async () => {
    try {
      const res = await fetch(`/api/clips/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      setClips(data);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchClips();
  }, [fetchClips]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div>
      <h1>View Shared Clips</h1>
      {/* refresh button */}
      <button
        className="bg-slate-600 text-white"
        onClick={fetchClips}
      >{`Refresh`}</button>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* 0 length clips */}
        {clips.length === 0 && <div>{`No clips made yet`}</div>}
        {clips.map((clip) => (
          <li
            key={clip.id}
            className="rounded-md border-2 border-slate-600 bg-slate-600 p-2 text-white"
          >
            {/* clip header */}
            <div className="flex justify-between text-2xl font-bold">
              <h1 className="text-2xl font-bold">{clip.title}</h1>
            </div>
            {/* clip content */}
            <div className="flex justify-between text-sm">
              <p>{clip.content}</p>
              {/* small copy button */}
              <button
                className="bg-black text-sm text-white"
                onClick={() => copyString(clip.content)}
              >{`Copy`}</button>
            </div>

            <div>
              {clip.allowed.length > 0 && (
                <>
                  {" "}
                  <h1>{`Allowed:`}</h1>
                  {clip.allowed}
                </>
              )}
              {clip.allowAll ? <h1>{`Allowed All`}</h1> : null}
              {clip.allowAll === false && clip.allowed.length === 0 ? (
                <h1>{`Not visible to anyone`}</h1>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

function copyString(text: string) {
  const el = document.createElement("textarea");
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

export default ViewSharedClips;
