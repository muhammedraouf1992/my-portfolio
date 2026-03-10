"use client";

import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="about" className=" py-24 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <div className="relative aspect-[3/4] w-full max-w-sm mx-auto md:mx-0 rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5">
          {/* Replace /about.jpg with your actual photo */}
          <Image
            src="/About-Image.jpeg"
            alt="Raouf"
            fill
            className="object-contain p-8"
          />
          {/* Decorative border offset */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-black/10 dark:ring-white/10" />
        </div>

        {/* Content */}
        <div style={{ fontFamily: "var(--font-poppins)" }}>
          <p className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4">
            About me
          </p>

          <h2 className="text-4xl font-bold text-black dark:text-white leading-tight mb-6">
            I build things <br />
            <span className="font-light">for the web.</span>
          </h2>

          <p className="text-black/60 dark:text-white/60 leading-relaxed mb-4">
            I&apos;m Raouf, a freelance web developer specialising in Next.js,
            WordPress and Shopify. I help businesses build fast, modern and
            scalable web experiences that look great and convert.
          </p>

          <p className="text-black/60 dark:text-white/60 leading-relaxed mb-10">
            Whether you need a custom e-commerce store, a high-performance
            marketing site, or a full-stack web app — I&apos;ve got you covered
            from design to deployment.
          </p>

          {/* Stats row */}
          <div className="flex gap-8 mb-10">
            {[
              { value: "3+", label: "Years experience" },
              { value: "50+", label: "Projects done" },
              { value: "30+", label: "Happy clients" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-black dark:text-white">
                  {value}
                </p>
                <p className="text-xs text-black/40 dark:text-white/40 mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <a
              href="/Muhammed_Abdelraouf_CV.pdf"
              download
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Download CV
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
