import { useCallback, useState } from "react";

import { Session } from "next-auth";

interface Props {
  session: Session;
}
const AddClip = ({}: Props) => {
  const [clip, setClip] = useState({
    title: "",
    content: "",
    allowed: "",
    allowAll: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const addClip = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/clips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...clip,
          allowed: clip.allowed.split(",").filter((email) => {
            return email.trim().length > 0 && email.includes("@");
          }),
        }),
      });
      if (!res.ok) {
        throw new Error("Error adding clip");
      }
      setClip({
        title: "",
        content: "",
        allowed: "",
        allowAll: false,
      });
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  }, [clip]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div>
      <h1>{`Add clip here`}</h1>
      {/* form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addClip();
        }}
      >
        <div>
          <label htmlFor="title">{`Title`}</label>
          <input
            className="rounded-md border border-gray-300"
            type="text"
            id="title"
            name="title"
            value={clip.title}
            onChange={(e) => setClip({ ...clip, title: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="content">{`Content`}</label>
          <input
            className="rounded-md border border-gray-300"
            type="text"
            id="content"
            name="content"
            value={clip.content}
            onChange={(e) => setClip({ ...clip, content: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="allowed">{`Allowed`}</label>
          <input
            className="rounded-md border border-gray-300"
            type="text"
            id="allowed"
            name="allowed"
            value={clip.allowed}
            onChange={(e) => setClip({ ...clip, allowed: e.target.value })}
          />
        </div>
        {/* allowAll checkbox */}
        <div>
          <label htmlFor="allowAll">{`Allow all`}</label>
          <input
            type="checkbox"
            id="allowAll"
            name="allowAll"
            checked={clip.allowAll}
            onChange={(e) => setClip({ ...clip, allowAll: e.target.checked })}
          />
        </div>

        <button type="submit">{`Add clip`}</button>
      </form>
    </div>
  );
};

export default AddClip;
