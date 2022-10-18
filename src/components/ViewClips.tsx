import { useCallback, useEffect, useState } from "react";

import { Clip } from "@prisma/client";
import { Session } from "next-auth";

interface Props {
  session: Session;
}
const ViewClips = ({}: Props) => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchClips = useCallback(async () => {
    try {
      const res = await fetch("/api/clips", {
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
  }, []);

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
              <h1>{`Allowed`}</h1>
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

export default ViewClips;
