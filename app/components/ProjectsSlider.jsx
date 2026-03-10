"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";

const PROJECTS = [
  {
    title: "Next JS",
    darkImage: "/next-js-logo-white-hd.png", // white logo — visible on dark bg
    lightImage: "/nextjs.png", // swap to a dark-logo file if you have one
  },
  {
    title: "Wordpress",
    darkImage: "/wordpress.png",
    lightImage: "/wordpress.png",
  },
  {
    title: "Shopify",
    darkImage: "/shopify.png",
    lightImage: "/shopify.png",
  },
];

const ROW_H = 144;

function ProjectCard({ project, index, total, progress }) {
  const transitions = total - 1;
  const isLast = index === transitions;

  const segStart = isLast ? 0 : index / transitions;
  const segEnd = isLast ? 1 : (index + 1) / transitions;

  const rotateX = useTransform(
    progress,
    [segStart, segEnd],
    isLast ? [0, 0] : [0, 180],
  );

  return (
    <motion.a
      className="absolute inset-0 rounded-2xl overflow-hidden  border-2 border-black/10 dark:border-white/10 shadow-lg bg-white dark:bg-background"
      style={{
        rotateX,
        zIndex: total - index,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transformOrigin: "center center",
      }}
    >
      {project.resolvedImage && (
        <Image
          src={project.resolvedImage}
          alt={project.title}
          fill
          className="object-contain p-10 pb-24"
        />
      )}
    </motion.a>
  );
}

function MarqueeRow({ text, direction }) {
  const items = Array(5).fill(text);
  return (
    <div className="overflow-hidden w-full" style={{ height: ROW_H }}>
      <motion.div
        className="flex items-center gap-16 h-full w-max"
        animate={{ x: direction > 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            className="text-[5rem] font-bold uppercase leading-none whitespace-nowrap select-none text-black/10 dark:text-white/10"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function ProjectsSlider() {
  const containerRef = useRef(null);
  const total = PROJECTS.length;
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === "dark" : true;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const marqueeY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(total - 1) * ROW_H],
  );

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${(total + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center gap-10 px-6 ">
        {/* Section title */}
        <div className="w-full max-w-2xl">
          <p
            className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-3"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            My Stack
          </p>
          <h2 style={{ fontFamily: "var(--font-poppins)" }}>
            <span className="block text-5xl font-light leading-tight text-black dark:text-white">
              What I
            </span>
            <span className="block text-5xl font-bold leading-tight text-black dark:text-white">
              Work With.
            </span>
          </h2>
        </div>

        {/* Card stack */}
        <div
          className="relative w-full max-w-2xl"
          style={{ height: 420, perspective: 1200 }}
        >
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={i}
              project={{
                ...project,
                resolvedImage: isDark ? project.darkImage : project.lightImage,
              }}
              index={i}
              total={total}
              progress={scrollYProgress}
            />
          ))}
        </div>

        {/* Scrolling project name marquee */}
        <div className="w-full overflow-hidden" style={{ height: ROW_H }}>
          <motion.div style={{ y: marqueeY }}>
            {PROJECTS.map((project, i) => (
              <MarqueeRow
                key={i}
                text={project.title}
                direction={i % 2 === 0 ? 1 : -1}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
