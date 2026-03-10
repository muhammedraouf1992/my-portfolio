"use client";

import { useState } from "react";

const TAGS = ["Next JS", "Wordpress", "Shopify"];

const EMPTY = {
  title: "",
  description: "",
  image: "",
  tag: "Next JS",
  href: "",
  featured: false,
};

export default function ProjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ?? EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      set("image", url);
    } else {
      setError("Image upload failed. Try again.");
    }
    setUploading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = initial ? `/api/projects/${initial.id}` : "/api/projects";
    const method = initial ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      setError("Something went wrong. Try again.");
      setLoading(false);
      return;
    }

    const saved = await res.json();
    onSave(saved);
    setLoading(false);
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 outline-none focus:border-black/30 dark:focus:border-white/30 transition-colors text-sm";

  const labelClass = "block text-xs font-medium text-black/50 dark:text-white/50 mb-1";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" style={{ fontFamily: "var(--font-poppins)" }}>
      <div>
        <label className={labelClass}>Title</label>
        <input className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="My Project" />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          required
          placeholder="Short description..."
        />
      </div>

      <div>
        <label className={labelClass}>Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className={inputClass} />
        {uploading && <p className="text-xs text-black/40 dark:text-white/40 mt-1">Uploading...</p>}
        {form.image && !uploading && (
          <img src={form.image} alt="preview" className="mt-2 h-24 w-full object-cover rounded-xl" />
        )}
      </div>

      <div>
        <label className={labelClass}>Tag</label>
        <select className={inputClass} value={form.tag} onChange={(e) => set("tag", e.target.value)}>
          {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>Project URL</label>
        <input className={inputClass} value={form.href} onChange={(e) => set("href", e.target.value)} required placeholder="https://..." />
      </div>

      <label className="flex items-center gap-2 text-sm text-black dark:text-white cursor-pointer select-none">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => set("featured", e.target.checked)}
          className="rounded"
        />
        Featured project
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex-1 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm disabled:opacity-50 transition-opacity"
        >
          {loading ? "Saving..." : initial ? "Update project" : "Add project"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-sm text-black dark:text-white hover:border-black/30 dark:hover:border-white/30 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
