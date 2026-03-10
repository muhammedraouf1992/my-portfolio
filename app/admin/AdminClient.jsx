"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import ProjectForm from "./components/ProjectForm";

const TAG_COLORS = {
  "Next JS": "bg-black text-white dark:bg-white dark:text-black",
  Wordpress: "bg-blue-600 text-white",
  Shopify: "bg-green-600 text-white",
};

export default function AdminClient({ initialProjects }) {
  const [projects, setProjects] = useState(initialProjects);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  function handleSaved(saved) {
    setProjects((prev) => {
      const exists = prev.find((p) => p.id === saved.id);
      if (exists) return prev.map((p) => (p.id === saved.id ? saved : p));
      return [saved, ...prev];
    });
    setShowForm(false);
    setEditing(null);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div
      className="mt-20 min-h-screen bg-background px-6 py-10"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Admin
            </h1>
            <p className="text-sm text-black/50 dark:text-white/50 mt-1">
              Manage your portfolio projects
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-semibold"
            >
              + Add project
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-sm text-black dark:text-white hover:border-black/30 dark:hover:border-white/30 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Form drawer */}
        {(showForm || editing) && (
          <div className="mb-8 p-6 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl">
            <h2 className="text-lg font-semibold text-black dark:text-white mb-5">
              {editing ? "Edit project" : "New project"}
            </h2>
            <ProjectForm
              initial={editing}
              onSave={handleSaved}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
            />
          </div>
        )}

        {/* Projects table */}
        {projects.length === 0 ? (
          <div className="text-center py-20 text-black/30 dark:text-white/30">
            No projects yet. Add your first one above.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${TAG_COLORS[project.tag]}`}
                    >
                      {project.tag}
                    </span>
                    {project.featured && (
                      <span className="text-xs text-yellow-500 font-medium">
                        ★ Featured
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-black dark:text-white truncate">
                    {project.title}
                  </p>
                  <p className="text-sm text-black/40 dark:text-white/40 truncate">
                    {project.description}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditing(project);
                      setShowForm(false);
                    }}
                    className="px-4 py-2 rounded-xl text-sm border border-black/10 dark:border-white/10 text-black dark:text-white hover:border-black/30 dark:hover:border-white/30 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-4 py-2 rounded-xl text-sm border border-red-500/20 text-red-500 hover:border-red-500/50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
