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

export default function GalleryV3() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const currentIndex = lightbox ? IMAGES.indexOf(lightbox) : -1;

  function prev() { if (currentIndex > 0) setLightbox(IMAGES[currentIndex - 1]); }
  function next() { if (currentIndex < IMAGES.length - 1) setLightbox(IMAGES[currentIndex + 1]); }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e0ffe0] font-mono">
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] text-[#00ff41]/50 mb-2">// VISUAL_ARCHIVE</p>
          <h1 className="text-2xl font-black tracking-widest text-[#00ff41] uppercase">Gallery</h1>
        </div>

        <div className="columns-2 sm:columns-3 lg:columns-4 gap-2 space-y-2">
          {IMAGES.map((src, i) => (
            <button
              key={src}
              onClick={() => setLightbox(src)}
              className="block w-full break-inside-avoid overflow-hidden border border-[#00ff41]/20 hover:border-[#00ff41] transition-colors focus:outline-none focus:ring-1 focus:ring-[#00ff41]/50 group"
            >
              <div className="relative">
                <img
                  src={src}
                  alt={`Gallery image ${i + 1}`}
                  className="w-full h-auto object-cover transition-all duration-300 group-hover:opacity-80"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#00ff41]/0 group-hover:bg-[#00ff41]/10 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end pb-1 px-2">
                  <span className="text-[9px] font-mono text-[#00ff41]">IMG_{String(i + 1).padStart(3, "0")}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/95 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            disabled={currentIndex === 0}
            className="absolute left-4 sm:left-8 flex h-12 w-12 items-center justify-center border border-[#00ff41]/40 bg-[#111111] text-[#00ff41] font-mono text-sm hover:border-[#00ff41] hover:bg-[#00ff41]/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            &lt;
          </button>

          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="border border-[#00ff41]/30 bg-[#111111] p-1">
              <div className="border-b border-[#00ff41]/20 px-3 py-1 flex items-center gap-2 mb-1">
                <span className="text-[#00ff41] text-xs font-mono">IMG_{String(currentIndex + 1).padStart(3, "0")}</span>
                <span className="text-[#00ff41]/40 text-xs font-mono ml-auto">{currentIndex + 1} / {IMAGES.length}</span>
              </div>
              <img
                src={lightbox}
                alt="Gallery"
                className="w-full max-h-[80vh] object-contain"
              />
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            disabled={currentIndex === IMAGES.length - 1}
            className="absolute right-4 sm:right-8 flex h-12 w-12 items-center justify-center border border-[#00ff41]/40 bg-[#111111] text-[#00ff41] font-mono text-sm hover:border-[#00ff41] hover:bg-[#00ff41]/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            &gt;
          </button>

          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center border border-[#00ff41]/40 bg-[#111111] text-[#00ff41] font-mono text-xs hover:border-[#00ff41] hover:bg-[#00ff41]/10 transition-colors"
          >
            [X]
          </button>
        </div>
      )}

      <footer className="border-t border-[#00ff41]/20 py-8 text-center">
        <p className="text-xs font-mono text-[#00ff41]/30 tracking-widest">
          &copy; {new Date().getFullYear()} CRASH_PULSE_TECHNOLOGIES :: ALL_RIGHTS_RESERVED
        </p>
      </footer>
    </main>
  );
}
