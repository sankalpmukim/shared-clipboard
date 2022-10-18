import { useCallback, useEffect, useState } from "react";

import { Clip } from "@prisma/client";
import { Session } from "next-auth";

interface Props {
  session: Session;
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
      <h1>View Clips</h1>
      {/* refresh button */}
      <button
        className="bg-slate-600 text-white"
        onClick={fetchClips}
      >{`Refresh`}</button>
      <ul>
        {/* 0 length clips */}
        {clips.length === 0 && <div>{`No clips made yet`}</div>}
        {clips.map((clip) => (
          <li key={clip.id}>
            <p>{clip.title}</p>
            <div>
              <h1>{`Allowed:`}</h1>
              <p>{clip.content}</p>
              <button
                onClick={() => {
                  copyString(clip.content);
                }}
              >
                {`Copy`}
              </button>
              {clip.allowed.map((v, i) => (
                <p key={i}>{v}</p>
              ))}
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
