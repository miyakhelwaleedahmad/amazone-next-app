import { useState } from "react";

export default function UploadProductImage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/products/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setMessage(`✅ File uploaded successfully! URL: ${data.url}`);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to upload file.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">📤 Upload Product Image</h1>

      {message && <p className="mb-4 text-blue-600">{message}</p>}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>
    </div>
  );
}
