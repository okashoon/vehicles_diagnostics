"use client";

import { useState } from "react";

const IMAGES = [
  "https://crashpulse.com/wp-content/uploads/2025/05/1-scaled.jpg",
  "https://crashpulse.com/wp-content/uploads/2025/05/2-scaled.jpg",
  "https://crashpulse.com/wp-content/uploads/2025/05/3-scaled.jpg",
  "https://crashpulse.com/wp-content/uploads/2025/05/4-scaled.jpg",
  "https://crashpulse.com/wp-content/uploads/2025/05/5-scaled.jpg",
  "https://crashpulse.com/wp-content/uploads/2025/05/6-scaled.jpg",
  "https://crashpulse.com/wp-content/uploads/2025/05/7-scaled.jpg",
  "https://crashpulse.com/wp-content/uploads/2026/03/IMG_2248.jpg",
  "https://crashpulse.com/wp-content/uploads/2026/03/IMG_2246.jpg",
  "https://crashpulse.com/wp-content/uploads/2026/03/IMG_2254.jpg",
  "https://crashpulse.com/wp-content/uploads/2026/03/IMG_2252.jpg",
  "https://crashpulse.com/wp-content/uploads/2026/03/IMG_2328.jpg",
  "https://crashpulse.com/wp-content/uploads/2026/03/IMG_2250.jpg",
];

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const currentIndex = lightbox ? IMAGES.indexOf(lightbox) : -1;

  function prev() {
    if (currentIndex > 0) setLightbox(IMAGES[currentIndex - 1]);
  }

  function next() {
    if (currentIndex < IMAGES.length - 1) setLightbox(IMAGES[currentIndex + 1]);
  }

  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white">
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-3xl font-extrabold text-white mb-10">Gallery</h1>

        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {IMAGES.map((src, i) => (
            <button
              key={src}
              onClick={() => setLightbox(src)}
              className="block w-full break-inside-avoid overflow-hidden rounded-xl border border-zinc-800 hover:border-[#e63946]/60 transition-colors focus:outline-none focus:ring-2 focus:ring-[#e63946]/50 group"
            >
              <img
                src={src}
                alt={`Gallery image ${i + 1}`}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            disabled={currentIndex === 0}
            className="absolute left-4 sm:left-8 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox}
              alt="Gallery"
              className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <p className="mt-2 text-center text-xs text-zinc-500">
              {currentIndex + 1} / {IMAGES.length}
            </p>
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            disabled={currentIndex === IMAGES.length - 1}
            className="absolute right-4 sm:right-8 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#e63946] transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <footer className="border-t border-zinc-800 bg-[#080b14] py-8 text-center">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Crash Pulse Technologies. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
