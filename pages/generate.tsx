import { useState } from "react";
import Head from "next/head"; // Optional: For SEO, no side-effects

export default function GeneratePage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ✅ Prevent full page reload

    if (!title.trim() || !body.trim()) return;

    setLoading(true);
    setGenerated("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body }),
      });

      const data = await response.json();

      if (data.generatedContent) {
        setGenerated(data.generatedContent);
      } else {
        setGenerated("⚠️ Error: No content returned.");
      }
    } catch (err) {
      console.error("Error:", err);
      setGenerated("❌ API call failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AI Generator</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div style={{ maxWidth: "720px", margin: "2rem auto", fontFamily: "sans-serif" }}>
        <h1>🧠 AI Content Generator</h1>
        <form
          onSubmit={handleGenerate}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          autoComplete="off"
        >
          <input
            type="text"
            placeholder="Enter a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ padding: "0.75rem", fontSize: "1rem" }}
          />
          <textarea
            placeholder="Enter some context or intro"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            style={{ padding: "0.75rem", height: "150px", fontSize: "1rem" }}
          />
          <button type="submit" disabled={loading} style={{ padding: "1rem", fontSize: "1rem" }}>
            {loading ? "Generating..." : "Generate with GPT-4"}
          </button>
        </form>

        {generated && (
          <div
            style={{
              marginTop: "2rem",
              background: "#f6f6f6",
              padding: "1rem",
              borderRadius: "8px",
              whiteSpace: "pre-line",
            }}
          >
            <h3>✨ Generated Content:</h3>
            <p>{generated}</p>
          </div>
        )}
      </div>
    </>
  );
}
