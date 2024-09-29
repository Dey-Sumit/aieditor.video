"use client";

import Hero from "~/components/hero-section";

export default function Home() {
  return (
    <div className="bg-black p-10">
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-gray-800 py-4 px-8 md:py-6 text-white backdrop-blur-md">
        <div className="text-sm font-semibold">aieditor.video</div>
        <div className="text-sm text-gray-100">Coming Soon</div>
      </nav>
      <main>
        <Hero />
      </main>
    </div>
  );
}
