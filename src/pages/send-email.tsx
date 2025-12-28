import { useState } from "react";

export default function SendEmailPage() {
  const [to, setTo] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, text }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Email sent successfully!");
        setTo("");
        setSubject("");
        setText("");
      } else {
        setMessage(`❌ Failed: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Error sending email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📧 Send Email</h1>
      <form onSubmit={handleSend} className="space-y-4">
        <input
          type="email"
          placeholder="Recipient Email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          className="w-full border p-2 rounded h-32"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Sending..." : "Send Email"}
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
