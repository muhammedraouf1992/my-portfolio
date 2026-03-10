"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const FILTERS = ["All", "Next JS", "Wordpress", "Shopify"];

const TAG_COLORS = {
  "Next JS": "bg-black text-white dark:bg-white dark:text-black",
  Wordpress: "bg-blue-600 text-white",
  Shopify: "bg-green-600 text-white",
};

function ProjectCard({ project }) {
  return (
    <motion.a
      href={project.href}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 hover:border-black/30 dark:hover:border-white/30 transition-colors"
    >
      {/* Image */}
      <div className="relative w-full aspect-video bg-black/5 dark:bg-white/5 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <span
          className={`self-start text-xs font-medium px-2.5 py-1 rounded-full ${TAG_COLORS[project.tag]}`}
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          {project.tag}
        </span>

        <h3
          className="text-lg font-semibold text-black dark:text-white leading-snug"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          {project.title}
        </h3>

        <p
          className="text-sm text-black/50 dark:text-white/50 leading-relaxed flex-1"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          {project.description}
        </p>

        <span className="text-sm font-medium text-black dark:text-white flex items-center gap-1 group-hover:gap-2 transition-all">
          View project
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 7h12M7 1l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </motion.a>
  );
}

export default function WorkSectionClient({ projects }) {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? projects : projects.filter((p) => p.tag === active);

  return (
    <section className=" py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p
            className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-3"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Selected work
          </p>
          <h2 style={{ fontFamily: "var(--font-poppins)" }}>
            <span className="block text-5xl font-light leading-tight text-black dark:text-white">
              My
            </span>
            <span className="block text-5xl font-bold leading-tight text-black dark:text-white">
              Projects.
            </span>
          </h2>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-10">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActive(filter)}
              className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              {active === filter && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-black dark:bg-white"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 transition-colors ${
                  active === filter
                    ? "text-white dark:text-black"
                    : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
                }`}
              >
                {filter}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
